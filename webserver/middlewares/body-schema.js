const Ajv = require('ajv').default;
const { invalidRequest } = require('../errors');
const schemaTranslator = require('../helpers/schema-translator');

const ajv = new Ajv();

module.exports = (schema) => {
    const schemaObject = schemaTranslator.translate(schema);
    const validate = ajv.compile(schemaObject);

    return (req, res, next) => {
        let valid = validate(req.body);
    
        /*console.dir(schemaObject, { depth: 8 });
        console.log({ valid });*/

        if (valid) {
            next();
        }
        else {
            throw invalidRequest;
        }
    };
};