const schema = {
    type: "array",
    minItems: 1,
    items: {
        type: "object",
        properties: {
            insert: {type: "string"},
            attributes: {
                type: "object",
                properties: {
                    color: { type: "string" },
                    link: { type: "string"},
                    list: { type: "string" },
                    header: { type: "number" },
                    bold: { type: "boolean" },
                    italic: { type: "boolean" },
                    underline: { type: "boolean" },
                },
                additionalProperties: false,
            },
            additionalProperties: false,
        },
        required: ["insert"],
    },
    description: "array of objects representing attributes and insert properties",
}

/*  refs:
    https://www.syncfusion.com/blogs/post/using-json-schema-for-json-validation
    https://medium.com/@AlexanderObregon/json-schema-a-guide-to-validating-your-json-data-9f225b2a17ef
    https://json-schema.org/understanding-json-schema/reference
    https://github.com/ajv-validator/ajv
*/

module.exports = schema;