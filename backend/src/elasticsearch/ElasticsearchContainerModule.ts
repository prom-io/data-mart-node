import {Global, Module} from "@nestjs/common";
import {ElasticsearchModule} from "@nestjs/elasticsearch";
import {config} from "../config";

@Global()
@Module({
    imports: [
        ElasticsearchModule.register({
            host: config.ELASTICSEARCH_HOST_URL,
            log: config.LOGGING_LEVEL
        })
    ],
    exports: [ElasticsearchModule]
})
export class ElasticsearchContainerModule {}
