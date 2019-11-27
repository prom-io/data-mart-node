import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {LoggerService} from "nest-logger";
import {filesSchema} from "../schema";

@Injectable()
export class ElasticsearchInitializer implements OnApplicationBootstrap {
    constructor(private readonly elasticSearchService: ElasticsearchService,
                private readonly log: LoggerService
    ) {}

    public onApplicationBootstrap(): any {
        this.log.info("Initializing elasticsearch indices");
        this.initializeFilesIndex();
    }

    private initializeFilesIndex(): Promise<void> {
        return this.initializeIndex(filesSchema, "files");
    }

    private initializeIndex(schema: any, indexName: string): Promise<void> {
        this.log.info(`Initializing ${indexName} index`);
        return new Promise<void>((resolve, reject) => {
            this.elasticSearchService.getClient().indices.exists({index: indexName}, (error, result, status) => {
                if (!result) {
                    this.elasticSearchService.getClient().indices.create({
                        index: indexName,
                        body: {
                            mappings: {
                                ...schema
                            }
                        }
                    }, (creationError, creationResult, creationStatus) => {
                        if (creationResult) {
                            this.log.info(`${indexName} index has been created successfully`);
                            resolve();
                        } else {
                            this.log.error(`Error occurred when tried to create ${indexName} index`);
                            this.log.debug(creationError);
                            reject(creationError);
                        }
                    })
                } else {
                    this.log.info(`Index ${indexName} already exists`);
                    resolve();
                }
            })
        })
    }
}
