export const filesSchema = {
    _doc: {
        properties: {
            id: {
                type: "keyword",
                index: true
            },
            name: {
                type: "text",
                index: true
            },
            metadata: {
                type: "nested",
                // index: true,
                properties: {
                    briefDescription: {
                        type: "text",
                        index: true
                    },
                    fullDescription: {
                        type: "text",
                        index: true
                    },
                    userComment: {
                        type: "text",
                        index: true
                    },
                    author: {
                        type: "text",
                        index: true
                    },
                    hashTags: {
                        type: "keyword"
                    }
                }
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
            },
            savedAt: {
                type: "number"
            }
        }
    }
};
