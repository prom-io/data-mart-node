import {Injectable} from "@nestjs/common";
import Axios, {AxiosError} from "axios";
import {LoggerService} from "nest-logger";
import {config} from "../../config";

// tslint:disable-next-line:no-var-requires
const kibanaSchema = require("../../../kibana-migration.json");

@Injectable()
export class KibanaInitializer {
    constructor(private readonly log: LoggerService) {}

    public initializeKibana(): Promise<void> {
        this.log.info("Initializing Kibana");
        return new Promise<void>((resolve, reject) => {
            Axios.post(
                `${config.KIBANA_HOST_URL}/api/kibana/dashboards/import`,
                kibanaSchema,
                {
                    headers: {
                        "kbn-xsrf": "reporting"
                    }
                }
            )
                .then(() => {
                    this.log.info("Kibana has been initialized without errors");
                    resolve();
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        this.log.error(`Error occurred when tried to initialize Kibana, it responded with ${error.response.status} status`);
                        this.log.error(error.stack);
                        reject(error);
                    } else {
                        this.log.error("Kibana API is unreachable");
                        reject(error);
                    }
                })
        })
    }
}
