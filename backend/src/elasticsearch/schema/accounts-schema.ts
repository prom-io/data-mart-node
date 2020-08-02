export const accountsSchema = {
    _doc: {
        properties: {
            address: {
                type: "text",
                index: true
            },
            type: {
                type: "text",
                index: false
            },
            userId: {
                type: "text",
                fields: {
                    keyword: {
                        type: "keyword",
                        ignore_above: 256
                    }
                }
            }
        }
    }
};
