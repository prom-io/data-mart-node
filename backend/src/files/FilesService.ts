import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import fileSystem from "fs";
import {Response} from "express";
import path from "path";
import {AxiosError} from "axios";
import {FilesRepository} from "./FilesRepository";
import {fileToFileResponse} from "./file-mappers";
import {ServiceNodeApiClient} from "../service-node-api";
import {PaginationRequest, PurchaseFileRequest, ServiceNodePurchaseFileRequest} from "../model/api/request";
import {FileResponse, PurchaseFileResponse} from "../model/api/response";
import {File} from "../model/domain";
import {config} from "../config";

@Injectable()
export class FilesService {
    constructor(
        private readonly filesRepository: FilesRepository,
        private readonly serviceNodeApiClient: ServiceNodeApiClient,
        private readonly log: LoggerService
    ) {};

    public searchFiles(query: string, paginationRequest: PaginationRequest): Promise<FileResponse[]> {
        return this.filesRepository
            .searchByQuery(query, paginationRequest)
            .then(files => files.map(file => fileToFileResponse(file)));
    }

    public searchFilesByQueryAndTags(query: string, tags: string[], paginationRequest: PaginationRequest): Promise<FileResponse[]> {
        return this.filesRepository
            .searchByQueryAndTags(query, tags, paginationRequest)
            .then(files => files.map(file => fileToFileResponse(file)));
    }

    public listAllFiles(): Promise<FileResponse[]> {
        return this.filesRepository
            .findAll()
            .then(files => files.map(file => fileToFileResponse(file)))
    }

    public listAllFilesPaginated(paginationRequest: PaginationRequest): Promise<FileResponse[]> {
        return this.filesRepository
            .findAllBy(paginationRequest)
            .then(files => files.map(file => fileToFileResponse(file)))
    }

    public async getFileInfoById(fileId: string): Promise<FileResponse> {
        const file = await this.filesRepository.findById(fileId);

        if (!file) {
            throw new HttpException(`Could not find file with id ${fileId}`, HttpStatus.NOT_FOUND);
        }

        return fileToFileResponse(file);
    }

    public async purchaseFile(fileId: string, purchaseFileRequest: PurchaseFileRequest): Promise<PurchaseFileResponse> {
        const file = await this.filesRepository.findById(fileId);

        if (!file) {
            throw new HttpException(`Could not find file with id ${fileId}`, HttpStatus.NOT_FOUND);
        }

        const serviceNodePurchaseFileRequest: ServiceNodePurchaseFileRequest = {
            dataMartAddress: purchaseFileRequest.dataMartAddress,
            dataValidatorAddress: file.dataValidator,
            serviceNodeAddress: config.SERVICE_NODE_ACCOUNT_ADDRESS,
            dataOwnerAddress: file.dataOwner,
            price: file.price,
            fileId
        };

        try {
            return (await this.serviceNodeApiClient.purchaseFile(serviceNodePurchaseFileRequest)).data;
        } catch (error) {
            if (error.response && error.response.status) {
                if (error.response.status === 404) {
                    throw new HttpException(
                        `Could not find file with id ${serviceNodePurchaseFileRequest.fileId}`,
                        HttpStatus.NOT_FOUND
                    )
                }
                this.log.error(`Error occurred when tried to purchase file, service node responded with ${error.response.status} status`);
                this.log.debug(error.trace);
                throw new HttpException(`Service node responded with ${error.response.status}`, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getFilesByDataValidator(dataValidatorAddress: string): Promise<FileResponse[]> {
        const files = await this.filesRepository.findByDataValidator(dataValidatorAddress);
        return files.map(file => fileToFileResponse(file));
    }

    public async getFileById(fileId: string, response: Response): Promise<void> {
        this.log.debug(`Trying to fetch file with id ${fileId}`);

        const file: File | undefined = await this.filesRepository.findById(fileId);

        if (!file) {
            throw new HttpException(`Could not find file with id ${fileId}`, HttpStatus.NOT_FOUND);
        }

        if (fileSystem.existsSync(path.join(config.PURCHASED_FILES_DIRECTORY, `${fileId}.${file.extension}`))) {
            response.download(path.join(config.PURCHASED_FILES_DIRECTORY, `${fileId}.${file.extension}`));
            return;
        }

        return this.serviceNodeApiClient.getFile(fileId)
            .then(({data}) => {
                this.log.info(`Retrieved file ${fileId} from service node`);
                data.pipe(fileSystem.createWriteStream(`${config.PURCHASED_FILES_DIRECTORY}/${fileId}.${file.extension}`));
                response.download(path.join(config.PURCHASED_FILES_DIRECTORY, `${fileId}.${file.extension}`));
            })
            .catch((error: AxiosError) => {
                this.log.error("Error occurred when tried to download file");
                this.log.debug(error.stack);

                if (error.response) {
                    this.log.error(`Service node responded with ${error.response.status} status`);
                    this.log.debug(`The following response has been received: ${JSON.stringify(error.response.data)}`);
                }
            })
    }
}
