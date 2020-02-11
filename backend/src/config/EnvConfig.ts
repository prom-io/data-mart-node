import {Env} from "env-decorator";

export class EnvConfig {
    @Env({required: true, type: "string"})
    ELASTICSEARCH_HOST_URL: string;

    @Env({required: true, type: "number"})
    DATA_MART_API_PORT: number;

    @Env({required: true, type: "string"})
    LOGGING_LEVEL: string;

    @Env({required: true, type: "string"})
    FILES_SYNCHRONIZATION_CRON: string;

    @Env({required: true, type: "string"})
    KIBANA_HOST_URL: string;

    @Env({required: true, type: "string"})
    PURCHASED_FILES_DIRECTORY: string;

    @Env({required: true, type: "string"})
    INITIAL_ACCOUNT_PRIVATE_KEY: string;

    @Env({required: true, type: "string"})
    ENCRYPTOR_SERVICE_URL: string;
}
