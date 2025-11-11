const schema = {
    type: "object",
    properties: {
        time: {type: "number"},
        blocks: {
            type: "array",
            minItems: 1,
            items: {
                type: "object",
                properties: {
                    id: {type: "string"},
                    data: {
                        type: "object",
                        properties: {
                            text: { type: "string" },
                            items: { 
                                type: "array", 
                                items: {
                                    type: "string",
                              } },
                            style: { type: "string" },
                            level: { type: "number" },
                        },
                        additionalProperties: false,
                    },
                    type: {type: "string"},
                },
                required: ["id", "data", "type"],
            },
            description: "blocks of text, each block represents a type. e.g header, paragraph etc..."
        },
        version: {type: "string"},
    },
    required: ["time", "blocks", "version"],
    additionalProperties: false,
}

/*  refs:
    https://www.syncfusion.com/blogs/post/using-json-schema-for-json-validation
    https://medium.com/@AlexanderObregon/json-schema-a-guide-to-validating-your-json-data-9f225b2a17ef
    https://json-schema.org/understanding-json-schema/reference
    https://github.com/ajv-validator/ajv
*/

module.exports = schema;