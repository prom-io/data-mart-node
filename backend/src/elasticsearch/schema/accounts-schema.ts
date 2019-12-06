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
            }
        }
    }
};
