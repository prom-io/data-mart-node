import {Body, Controller, Get, Param, Post, Query, Res} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response} from "express";
import {FilesService} from "./FilesService";
import {FileResponse, PurchaseFileResponse} from "../model/api/response";
import {PurchaseFileRequest} from "../model/api/request";
import {getValidPage, getValidPageSize} from "../utils/pagination";

@Controller("api/v2/files")
export class FilesController {
    constructor(private readonly filesService: FilesService,
                private readonly log: LoggerService) {}

    @Get()
    public async getFilesOfDataValidator(
        @Query("dataValidator") dataValidatorAddress?: string,
        @Query("page") page?: number,
        @Query("size") size?: number
    ): Promise<FileResponse[]> {
        if (dataValidatorAddress) {
            this.log.info(`Retrieving files of data validator ${dataValidatorAddress}`);
            return this.filesService.getFilesByDataValidator(dataValidatorAddress);
        } else {
            if (page) {
                page = getValidPage(page, 1);
                size = getValidPageSize(size, 500);

                this.log.info("Retrieving paginated files");
                return this.filesService.listAllFilesPaginated({page, size})
            } else {
                this.log.info("Retrieving all files");
                return this.filesService.listAllFiles();
            }
        }
    }

    @Get(":id")
    public async getFileById(@Param("id") fileId: string, @Res() response: Response): Promise<void> {
        return this.filesService.getFileById(fileId, response);
    }

    @Get(":id/info")
    public async getFileInfoByFileId(@Param("id") fileId: string): Promise<FileResponse> {
        return this.filesService.getFileInfoById(fileId);
    }

    @Post(":id/purchase")
    public async purchaseFile(@Param("id") fileId: string,
                              @Body() purchaseFileRequest: PurchaseFileRequest): Promise<PurchaseFileResponse> {
        return this.filesService.purchaseFile(fileId, purchaseFileRequest);
    }
}
