export const usersSchema = {
    _doc: {
        properties: {
            id: {
                type: "text",
                fields: {
                    keyword: {
                        type: "keyword",
                        ignore_above: 256
                    }
                }
            },
            passwordHash: {
                type: "text",
                index: false
            },
            lambdaWallet: {
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
