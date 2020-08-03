import {FileMetadata} from "./FileMetadata";
import {FileKey} from "../FileKey";

export interface File {
    id: string,
    metadata: FileMetadata,
    savedAt: number,
    dataValidator: string,
    dataOwner: string,
    serviceNode: string,
    keepUntil: string,
    extension: string,
    mimeType: string,
    size: number,
    price: number,
    name: string,
    key?: FileKey
}
