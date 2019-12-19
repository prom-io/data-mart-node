import {parse} from "date-fns";
import {File} from "../model/domain";
import {FileResponse} from "../model/api/response";

export const fileToFileResponse = (file: File): FileResponse => ({
    id: file.id,
    dataOwner: file.dataOwner,
    dataValidator: file.dataValidator,
    extension: file.extension,
    keepUntil: file.keepUntil && file.keepUntil.toDateString(),
    metadata: file.metadata,
    mimeType: file.mimeType,
    price: file.price,
    serviceNode: file.serviceNode,
    size: file.size,
    name: file.name
});

export const fileResponseToFile = (fileResponse: FileResponse, timestamp: number | undefined = new Date().getTime()): File => ({
    id: fileResponse.id,
    size: fileResponse.size,
    serviceNode: fileResponse.serviceNode,
    price: fileResponse.price,
    mimeType: fileResponse.mimeType,
    metadata: fileResponse.metadata,
    keepUntil: parse(fileResponse.keepUntil, "yyyy-MM-dd'T'hh:mm:ss'Z'", new Date()),
    extension: fileResponse.extension,
    dataValidator: fileResponse.dataValidator,
    dataOwner: fileResponse.dataOwner,
    name: fileResponse.name,
    savedAt: timestamp
});
