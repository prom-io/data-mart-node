import {Injectable} from "@nestjs/common";
import {NestSchedule, Cron} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {fileResponseToFile} from "./file-mappers";
import {FilesRepository} from "./FilesRepository";
import {ServiceNodeApiClient} from "../service-node-api";
import {config} from "../config";

// Do not persist these files to Elasticsearch because they have been saved to smart contracts
// directly via Billing API rather than being uploaded via Service Node API, thus being
// absent in DDS. The attempt to purchase these files will result in error.
const IGNORED_FILES: string[] = [
    "b1dcc4d4-ef8f-4086-af44-7ae789bac728",
    "354282e1-632e-481d-8851-80a83ffcab01",
    "eacdc1d6-6c6e-4453-8f1d-a22ed2bde4b1"
];

@Injectable()
export class FilesSynchronizationScheduler extends NestSchedule {
    private currentPage: number = 0;
    private readonly pageSize: number = 100;

    constructor(
        private readonly serviceNodeApiClient: ServiceNodeApiClient,
        private readonly filesRepository: FilesRepository,
        private readonly log: LoggerService
    ) {
        super()
    }

    @Cron(config.FILES_SYNCHRONIZATION_CRON, {
        waiting: true,
        immediate: true
    })
    public async syncFiles() {
        this.log.info("Synchronizing files");
        let done: boolean = false;

        while (!done) {
            try {
                let files = (await this.serviceNodeApiClient.getFiles({page: this.currentPage, size: this.pageSize})).data;
                this.log.debug(`Retrieved files: ${JSON.stringify(files)}`);

                if (files.length !== 0) {
                    this.log.info("Saving files");
                    files = files.filter(file => !IGNORED_FILES.includes(file.id));
                    await this.filesRepository.saveAll(files.map(fileResponse => fileResponseToFile(fileResponse)));
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
