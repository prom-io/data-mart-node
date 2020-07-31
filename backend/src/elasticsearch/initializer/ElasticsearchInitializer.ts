import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {LoggerService} from "nest-logger";
import {KibanaInitializer} from "./KibanaInitializer";
import {filesSchema, accountsSchema, fileKeysSchema, usersSchema} from "../schema";

@Injectable()
export class ElasticsearchInitializer implements OnApplicationBootstrap {
    private indexesInitialized = false;

    constructor(private readonly elasticSearchService: ElasticsearchService,
                private readonly kibanaInitializer: KibanaInitializer,
                private readonly log: LoggerService
    ) {}

    public areIndexesInitialized(): boolean {
        return this.indexesInitialized;
    }

    public onApplicationBootstrap(): any {
        this.log.info("Initializing elasticsearch indices");
        Promise.all([
            this.initializeFilesIndex(),
            this.initializeAccountsIndex(),
            this.initializeFileKeysIndex(),
            this.initializeUsersIndex()
        ])
            .then(() => this.indexesInitialized = true)
            .then(() => this.kibanaInitializer.initializeKibana())
    }

    private initializeFilesIndex(): Promise<void> {
        return this.initializeIndex(filesSchema, "files");
    }

    private initializeAccountsIndex(): Promise<void> {
        return this.initializeIndex(accountsSchema, "accounts");
    }

    private initializeFileKeysIndex(): Promise<void> {
        return this.initializeIndex(fileKeysSchema, "file_keys");
    }

    private initializeUsersIndex(): Promise<void> {
        return this.initializeIndex(usersSchema, "users");
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
                        this.log.info(creationResult);
                        this.log.info(creationStatus);
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
