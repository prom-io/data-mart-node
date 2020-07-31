import {Injectable} from "@nestjs/common";
import {ElasticsearchService} from "@nestjs/elasticsearch";
import {CreateDocumentResponse} from "elasticsearch";
import {User} from "../model/domain";
import {map} from "rxjs/operators";
import uuid4 from "uuid/v4";

@Injectable()
export class UsersRepository {
    constructor(private readonly elasticsearchService: ElasticsearchService) {
    }

    public save(user: User): Promise<CreateDocumentResponse> {
        return this.elasticsearchService.bulk({
            body: [user].map(savedUser => [{index: {_index: "users", _id: user.id}}, savedUser])
                .reduce((left, right) => left.concat(right)),
            index: "accounts",
            type: "_doc"
        })
            .toPromise()
    }

    public findById(id: string): Promise<User | undefined> {
        // @ts-ignore
        return this.elasticsearchService.get<User | undefined>({
            index: "users",
            id
        })
            .pipe(map(response => response[0]._source))
            .toPromise()
    }

    public async findByLambdaWallet(lambdaWallet: string): Promise<User | undefined> {
        const users = await this.elasticsearchService.search({
            index: "users",
            body: {
                query: {
                    match: {
                        lambdaWallet
                    }
                }
            }
        })
            .pipe(map(searchResponse => searchResponse[0].hits.hits.map(hit => hit._source)))
            .toPromise();

        if (users.length !== 0) {
            return users[0];
        }

        return undefined;
    }
}
