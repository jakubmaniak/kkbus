const errors = require('../errors');
const reqValidator = require('../req-validator');

module.exports = (schema) => (req, res, next) => {
    //reqValidator.addSchema(req.route.path, schema);
    next();
};