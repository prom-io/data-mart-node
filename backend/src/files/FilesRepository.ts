import {Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {map} from "rxjs/operators";
import {CreateDocumentResponse} from "elasticsearch";
import {File} from "../model/domain";
import {PaginationRequest} from "../model/api/request";
import {calculateOffset} from "../utils/pagination";

@Injectable()
export class FilesRepository {
    constructor(
        private readonly elasticSearchService: ElasticsearchService,
        private readonly log: LoggerService
    ) {}

    public save(file: File): Promise<CreateDocumentResponse> {
        return this.elasticSearchService.create({
            id: file.id,
            body: file,
            index: "files",
            type: "_doc"
        })
            .toPromise()
    }

    public saveAll(files: File[]): Promise<void> {
        return this.elasticSearchService.bulk({
            // have to use @ts-ignore because for some reason Intellij IDEA can't see that arrays actually have flatMap method
            // @ts-ignore
            body: files.flatMap(file => [{index: {_index: "files", _id: file.id}}, file]),
            index: "files",
            type: "_doc"
        })
            .toPromise()
    }

    public findAll(): Promise<File[]> {
        return this.elasticSearchService.search<File>({
            index: "files",
            size: 500
        })
            .pipe(map(searchResponse => {
                return searchResponse[0].hits.hits.map(hit => {
                    return hit._source;
                });
            }))
            .toPromise()
    }

    public findAllBy(paginationRequest: PaginationRequest): Promise<File[]> {
        return this.elasticSearchService.search<File>({
            index: "files",
            from: calculateOffset(paginationRequest.page, paginationRequest.size),
            size: paginationRequest.size
        })
            .pipe(map(searchResponse => {
                return searchResponse[0].hits.hits.map(hit => hit._source)
            }))
            .toPromise()
    }

    public findById(fileId: string): Promise<File | undefined> {
        // Have to use @ts-ignore here because GetParams type requires 'type' field to be present.
        // However, this parameter has been deprecated and including it in request will lead to a wrong query.
        // @ts-ignore
        return this.elasticSearchService.get<File | undefined>({
            index: "files",
            id: fileId
        })
            .pipe(map(response => {
                // Have to use @ts-ignore here as response variable has 'unknown' type (because of the previous @ts-ignore)
                // @ts-ignore
                // Elasticsearch client actually does not return object with GetResponse type.
                // It returns array where the first element is an object with GetResponse type and the second is response status.
                // So it's required to access [0] element of array to get the actual response.
                return response[0]._source as File | undefined;
            }))
            .toPromise()
    }

    public findByDataValidator(dataValidatorAddress: string): Promise<File[]> {
        return this.elasticSearchService.search<File>({
            index: "files",
            body: {
                query: {
                    match: {
                        dataValidator: dataValidatorAddress
                    }
                }
            }
        })
        // Elasticsearch client actually does not return object with GetResponse type.
        // It returns array where the first element is an object with GetResponse type and the second is response status.
        // So I have to access [0] element of array to get the actual response.
            .pipe(map(searchResponse => searchResponse[0].hits.hits.map(hit => hit._source)))
            .toPromise()
    }

    public searchByQuery(query: string, paginationRequest: PaginationRequest): Promise<File[]> {
        return this.elasticSearchService.search<File>({
            index: "files",
            from: calculateOffset(paginationRequest.page, paginationRequest.size),
            size: paginationRequest.size,
            body: {
                query: {
                    multi_match: {
                        query
                    }
                },
                sort: {
                    savedAt: {
                        order: "desc"
                    }
                }
            }
        })
            .pipe(map(searchResponse => searchResponse[0].hits.hits.map(hit => hit._source)))
            .toPromise()
    }

    public searchByQueryAndTags(query: string, hashTags: string[], paginationRequest: PaginationRequest): Promise<File[]> {
        return this.elasticSearchService.search<File>({
            index: "files",
            from: calculateOffset(paginationRequest.page, paginationRequest.size),
            size: paginationRequest.size,
            body: {
                query: {
                    bool: {
                        must: {
                            multi_match: {
                                query
                            }
                        },
                        filter: {
                            terms: {
                                "metadata.hashTags": hashTags.map(hashTag => hashTag.toLocaleLowerCase())
                            }
                        }
                    }
                },
                sort: {
                    savedAt: {
                        order: "desc"
                    }
                }
            }
        })
            .pipe(map(searchResponse => searchResponse[0].hits.hits.map(hit => hit._source)))
            .toPromise()
    }
}
