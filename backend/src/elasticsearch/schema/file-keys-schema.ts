export const fileKeysSchema = {
    _doc: {
        properties: {
            id: {
                type: "keyword",
                index: true
            },
            fileId: {
                type: "keyword",
                index: true
            },
            userId: {
                type: "keyword",
                index: true
            },
            iv: {
                type: "keyword",
                index: true
            },
            key: {
                type: "keyword",
                index: true
            }
        }
    }
}
