import {Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import {Response, Request} from "express";
import {FilesService} from "./FilesService";
import {FileResponse, PurchaseFileResponse} from "../model/api/response";
import {PurchaseFileRequest} from "../model/api/request";
import {getValidPage, getValidPageSize} from "../utils/pagination";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";
import {User} from "../model/domain";

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

    @Get("search")
    public async searchFiles(@Query("query") query?: string,
                             @Query("tags") tags?: string,
                             @Query("page") page?: number,
                             @Query("size") size?: number): Promise<FileResponse[]> {
        page = getValidPage(page);
        size = getValidPageSize(size);

        if (!query) {
            query = "";
        }

        if (tags) {
            const tagsToSearch: string[] = JSON.parse(tags);
            return this.filesService.searchFilesByQueryAndTags(query, tagsToSearch, {page, size})
        } else {
            return this.filesService.searchFiles(query, {page, size});
        }
    }

    @Get("search/count")
    public async countSearchResults(@Query("query") query?: string,
                                    @Query("tags") tags?: string): Promise<{count: number}> {
        if (!query) {
            query = "";
        }

        if (tags) {
            const tagsToSearch: string[] = JSON.parse(tags);
            return this.filesService.countFilesByQueryAndTags(query, tagsToSearch);
        } else {
            return this.filesService.countFilesByQuery(query);
        }
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(":id")
    public async getFileById(@Param("id") fileId: string, @Res() response: Response, @Req() request: Request): Promise<void> {
        return this.filesService.getFileById(fileId, response, (request as any).user as User | null);
    }

    @Get(":id/info")
    public async getFileInfoByFileId(@Param("id") fileId: string): Promise<FileResponse> {
        return this.filesService.getFileInfoById(fileId);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Post(":id/purchase")
    public async purchaseFile(@Param("id") fileId: string,
                              @Body() purchaseFileRequest: PurchaseFileRequest,
                              @Req() request: Request): Promise<PurchaseFileResponse> {
        return this.filesService.purchaseFile(fileId, purchaseFileRequest, (request as any).user as User | null);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(":id/regain")
    public async regainFile(@Param("id") fileId: string, @Res() response: Response, @Req() request: Request): Promise<void> {
        return this.filesService.getFileById(fileId, response, (request as any).user as User | null);
    }
}
