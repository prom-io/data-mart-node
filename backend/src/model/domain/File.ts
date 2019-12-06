import {FileMetadata} from "./FileMetadata";

export interface File {
    id: string,
    metadata: FileMetadata,
    dataValidator: string,
    dataOwner: string,
    serviceNode: string,
    keepUntil: Date,
    extension: string,
    mimeType: string,
    size: number,
    price: number,
    name: string
}
