import {AxiosError} from "axios";
import {ApiError, DATA_MART_API_UNREACHABLE_CODE} from "./ApiError";

export const createErrorFromResponse = (axiosError: AxiosError): ApiError => {
    if (axiosError.response) {
        return {
            status: axiosError.response.status
        }
    } else {
        return {
            status: DATA_MART_API_UNREACHABLE_CODE
        }
    }
};
