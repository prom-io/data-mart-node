import {FileMetadata} from "../../domain";

export interface FileResponse {
    id: string,
    metadata: FileMetadata;
    dataValidator: string,
    dataOwner: string,
    serviceNode: string,
    keepUntil: string,
    extension: string,
    mimeType: string,
    size: number,
    price: number,
    name: string,
    purchased: boolean
}
