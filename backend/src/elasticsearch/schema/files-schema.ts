export const filesSchema = {
    _doc: {
        properties: {
            id: {
                type: "keyword",
                index: true
            },
            name: {
                type: "keyword",
                index: true
            },
            metadata: {
                type: "nested"
            },
            dataValidator: {
                type: "keyword",
                index: true
            },
            extension: {
                type: "keyword",
                index: true
            },
            mimeType: {
                type: "keyword",
                index: true
            },
            price: {
                type: "double",
                index: false
            }
        }
    }
};
