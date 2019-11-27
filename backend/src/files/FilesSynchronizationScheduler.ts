import {Injectable} from "@nestjs/common";
import {NestSchedule, Cron} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {fileResponseToFile} from "./file-mappers";
import {FilesRepository} from "./FilesRepository";
import {ServiceNodeApiClient} from "../service-node-api";

@Injectable()
export class FilesSynchronizationScheduler extends NestSchedule {
    private currentPage: number = 0;

    constructor(
        private readonly serviceNodeApiClient: ServiceNodeApiClient,
        private readonly filesRepository: FilesRepository,
        private readonly log: LoggerService
    ) {
        super()
    }

    @Cron("*/10 * * * *", {
        waiting: true,
        immediate: true
    })
    public async syncFiles() {
        this.log.info("Synchronizing files");
        let done: boolean = false;

        while (!done) {
            try {
                const files = (await this.serviceNodeApiClient.getFiles({page: this.currentPage, size: 1000})).data;
                this.log.debug(`Retrieved files: ${JSON.stringify(files)}`);

                if (files.length !== 0) {
                    this.log.info("Saving files");
                    await this.filesRepository.saveAll(files.map(fileResponse => fileResponseToFile(fileResponse)));
                    this.currentPage += 1;
                } else {
                    this.log.info("No more files to retrieve");
                    done = true;
                }
            } catch (error) {
                this.log.error("Error occurred when tried to fetch files");
                this.log.debug(`${error}`);
                done = true;
            }
        }
    }
}
