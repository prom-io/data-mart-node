import {Module} from "@nestjs/common";
import {ElasticsearchInitializer} from "./ElasticsearchInitializer";

@Module({
    providers: [ElasticsearchInitializer],
})
export class ElasticsearchInitializerModule {}
