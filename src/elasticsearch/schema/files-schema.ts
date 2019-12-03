export const filesSchema = {
    _doc: {
        properties: {
            id: {
                type: "string",
                index: "not_analyzed"
            },
            name: {
                type: "string",
                index: "analyzed"
            },
            metadata: {
                type: "nested"
            },
            dataValidator: {
                type: "string",
                index: "not_analyzed"
            },
            dataOwner: {
                type: "string",
                index: "not_analyzed"
            },
            serviceNode: {
                type: "string",
                index: "not_analyzed"
            },
            keepUntil: {
                type: "date",
                index: "not_analyzed",
                format: "yyyy-MM-dd'T'HH:mm:ss"
            },
            extension: {
                type: "string",
                index: "not_analyzed"
            },
            mimeType: {
                type: "string",
                index: "not_analyzed"
            },
            price: {
                type: "number",
                index: "not_analyzed"
            }
        }
    }
};
