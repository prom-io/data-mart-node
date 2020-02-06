import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import uuid4 from "uuid/v4";
import fileSystem from "fs";
import {Response} from "express";
import path from "path";
import {AxiosError} from "axios";
import {FileKeysRepository} from "./FileKeysRepository";
import {FilesRepository} from "./FilesRepository";
import {fileToFileResponse} from "./file-mappers";
import {ServiceNodeApiClient} from "../service-node-api";
import {PaginationRequest, PurchaseFileRequest, ServiceNodePurchaseFileRequest} from "../model/api/request";
import {FileResponse, PurchaseFileResponse} from "../model/api/response";
import {File, SavedFileKey} from "../model/domain";
import {config} from "../config";
import {Web3Wrapper} from "../web3";
import {EncryptorServiceClient} from "../encryptor";
import {AccountsRepository} from "../accounts/AccountsRepository";
import {AesDecryptRequest} from "../encryptor/types/request";
import {FileKey} from "../model";

@Injectable()
export class FilesService {
    constructor(
        private readonly filesRepository: FilesRepository,
        private readonly fileKeysRepository: FileKeysRepository,
        private readonly serviceNodeApiClient: ServiceNodeApiClient,
        private readonly accountsRepository: AccountsRepository,
        private readonly web3Wrapper: Web3Wrapper,
        private readonly log: LoggerService,
        private readonly encryptorServiceClient: EncryptorServiceClient
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

        const accounts = (await this.accountsRepository.findAll())
            .filter(account => account.address === purchaseFileRequest.dataMartAddress);

        if (accounts.length === 0) {
            throw new HttpException(`Could not find account with address ${purchaseFileRequest.dataMartAddress}`, HttpStatus.NOT_FOUND);
        }

        const account = accounts[0];

        const serviceNodePurchaseFileRequest: ServiceNodePurchaseFileRequest = {
            dataMartAddress: purchaseFileRequest.dataMartAddress,
            dataValidatorAddress: file.dataValidator,
            dataOwnerAddress: file.dataOwner,
            price: file.price,
            fileId,
            signature: undefined
        };

        serviceNodePurchaseFileRequest.signature = this.web3Wrapper.singData(serviceNodePurchaseFileRequest, account.privateKey);

        try {
            const purchaseResponse: PurchaseFileResponse = (await this.serviceNodeApiClient.purchaseFile(serviceNodePurchaseFileRequest)).data;

            const savedFileKey: SavedFileKey = {
                fileId,
                id: uuid4(),
                iv: purchaseResponse.fileKey.iv,
                key: purchaseResponse.fileKey.key
            };

            await this.fileKeysRepository.saveAll([savedFileKey]);

            return purchaseResponse;
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status) {
                console.log(error);
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
            const fileKeys: SavedFileKey[] = await this.fileKeysRepository.findByFileId(file.id);
            if (fileKeys.length !== 0) {
                await this.decryptAndSendFile(file, fileKeys[0], response);
            } else {
                response.download(path.join(config.PURCHASED_FILES_DIRECTORY, `${fileId}.${file.extension}`));
            }
            return;
        }

        return new Promise((resolve, reject) => {
            this.serviceNodeApiClient.getFile(fileId)
                .then(({data}) => {
                    this.log.info(`Retrieved file ${fileId} from service node`);
                    const fileStream = fileSystem.createWriteStream(`${config.PURCHASED_FILES_DIRECTORY}/${fileId}.${file.extension}`);
                    data.pipe(fileStream);
                    fileStream.on("finish", async () => {
                        const fileKeys = await this.fileKeysRepository.findByFileId(file.id);
                        if (fileKeys.length !== 0) {
                            await this.decryptAndSendFile(file, fileKeys[0], response);
                            resolve();
                        } else {
                            response.download(path.join(config.PURCHASED_FILES_DIRECTORY, `${fileId}.${file.extension}`));
                            resolve();
                        }
                    })
                })
                .catch((error: AxiosError) => {
                    this.log.error("Error occurred when tried to download file");
                    this.log.debug(error.stack);

                    if (error.response) {
                        this.log.error(`Service node responded with ${error.response.status} status`);
                        this.log.debug(`The following response has been received: ${JSON.stringify(error.response.data)}`);
                    }

                    reject(error);
                })
        })
    }

    private async decryptAndSendFile(file: File, fileKey: SavedFileKey, response: Response): Promise<void> {
        this.log.debug(`Decrypting file with id ${file.id}`);
        const physicalFile: Buffer = fileSystem.readFileSync(path.join(config.PURCHASED_FILES_DIRECTORY, `${file.id}.${file.extension}`));
        const base64String = physicalFile.toString("base64");
        const aesDecryptRequest: AesDecryptRequest = {
            content: base64String,
            iv: fileKey.iv,
            key: fileKey.key
        };
        const decrypted = (await this.encryptorServiceClient.decryptWithAes(aesDecryptRequest)).data.result.content;
        fileSystem.writeFileSync(
            path.join(config.PURCHASED_FILES_DIRECTORY, `${file.id}.${file.extension}.decrypted`),
            decrypted,
            {encoding: "base64"}
        );
        response.download(path.join(config.PURCHASED_FILES_DIRECTORY, `${file.id}.${file.extension}.decrypted`));
    }
}
