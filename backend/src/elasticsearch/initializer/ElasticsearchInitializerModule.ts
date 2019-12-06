import {Module} from "@nestjs/common";
import {ElasticsearchInitializer} from "./ElasticsearchInitializer";
import {KibanaInitializer} from "./KibanaInitializer";

@Module({
    providers: [ElasticsearchInitializer, KibanaInitializer],
})
export class ElasticsearchInitializerModule {}
