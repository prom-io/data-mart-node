import {Injectable} from "@nestjs/common";
import {NestSchedule, Cron} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {fileResponseToFile} from "./file-mappers";
import {FilesRepository} from "./FilesRepository";
import {ServiceNodeApiClient} from "../service-node-api";
import {config} from "../config";
import {RoundRobinLoadBalancerClient} from "../discovery";

@Injectable()
export class FilesSynchronizationScheduler extends NestSchedule {
    private currentPage: number = 0;
    private readonly pageSize: number = 100;

    constructor(
        private readonly serviceNodeApiClient: ServiceNodeApiClient,
        private readonly filesRepository: FilesRepository,
        private readonly log: LoggerService,
        private readonly loadBalancerClient: RoundRobinLoadBalancerClient
    ) {
        super()
    }

    @Cron(config.FILES_SYNCHRONIZATION_CRON, {
        waiting: true,
        immediate: true,
    })
    public async syncFiles(): Promise<void> {
        if (!this.loadBalancerClient.isLoadBalancerInitialized()) {
            this.log.info("Deferring file initialization because load balancer client is not yet initialized. Retrying in 3 seconds");
            setTimeout(() => this.syncFiles(), 3000);
            return ;
        }

        this.log.info("Synchronizing files");
        let done: boolean = false;
        while (!done) {
            try {
                const files = (await this.serviceNodeApiClient.getFiles({page: this.currentPage, size: this.pageSize})).data;

                if (files.length !== 0) {
                    this.log.info("Saving files");
                    console.log(files);
                    const filesToSave = files
                        .filter(file => file.price !== null && file.price !== undefined)
                        .map((fileResponse, index) => fileResponseToFile(
                            fileResponse,
                            new Date().getTime() + (index * 1000)
                        ));
                    await this.filesRepository.saveAll(filesToSave);
                    this.currentPage += 1;
                } else {
                    this.log.info("No more files to retrieve");
                    this.currentPage = this.currentPage - 1;
                    done = true;
                }
            } catch (error) {
                this.log.error("Error occurred when tried to fetch files");
                this.log.debug(`${error}`);
                console.log(error.trace);
                console.log(error);
                done = true;
            }
        }
    }
}
