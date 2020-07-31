export const accountsSchema = {
    _doc: {
        properties: {
            address: {
                type: "text",
                index: false
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
