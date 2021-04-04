const Ajv = require('ajv').default;
const { invalidRequest } = require('../errors');
const schemaTranslator = require('../helpers/schema-translator');
const nullize = require('../helpers/schema-nullize');

const ajv = new Ajv();

module.exports = (schema) => {
    const schemaObject = schemaTranslator.translate(schema);
    const validate = ajv.compile(schemaObject);

    return (req, res, next) => {
        let valid = validate(req.body);

        if (valid) {
            req.body = nullize(req.body, schemaObject);
            next();
        }
        else {
            throw invalidRequest();
        }
    
        /*console.dir(schemaObject, { depth: 8 });
        console.log({ valid });*/
    };
};