import {FileMetadata} from "../models/FileMetadata";

const FILE_EXTENSIONS_SUBSTITUTES = new Map<string, string>();

FILE_EXTENSIONS_SUBSTITUTES.set(".document", "docx");
FILE_EXTENSIONS_SUBSTITUTES.set("-excel", "xls");
FILE_EXTENSIONS_SUBSTITUTES.set("plain", "txt");

export const getFileExtension = (base64Data: string): string => {
    const matches = base64Data.match(/[^:/]\w+(?=;|,)/);

    if (matches !== null && matches.length !== 0) {
        let fileExtension = matches[0];

        if (FILE_EXTENSIONS_SUBSTITUTES.has(fileExtension)) {
            fileExtension = FILE_EXTENSIONS_SUBSTITUTES.get(fileExtension)!;
        }

        return fileExtension;
    }

    return "unknown";
};

export const getFileMimeType = (base64Data: string): string => {
    const matches = base64Data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);

    if (matches !== null && matches.length !== 0) {
        return matches[0];
    }

    return "unknown";
};

export const getFileSizeInBytes = (base64Data: string): number => {
    const base64Length = base64Data.length - (base64Data.indexOf(',') + 1);
    const padding = (base64Data.charAt(base64Data.length - 2) === '=') ? 2 : ((base64Data.charAt(base64Data.length - 1) === '=') ? 1 : 0);
    return base64Length * 0.75 - padding;
};

export const convertToBase64 = (blob: Blob): Promise<string> => new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = error => reject(error);
});

export const removeBase64Header = (base64String: string): string => base64String.substring(base64String.indexOf(";base64,") + ";base64,".length);

export const getMetadataKeyLabel = (key: keyof FileMetadata| string): string => {
    switch (key) {
        case "briefDescription":
            return "Brief description";
        case "fullDescription":
            return "Full description";
        case "userComment":
            return "Comment";
        case "hashTags":
            return "Hash tags";
        case "author":
            return "Author";
        default:
            return key;
    }
};
