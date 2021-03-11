const errors = require('./error-codes');

class RequestValidator {
    constructor() {
        this.schemas = new Map();
        this.protectedPaths = new Set();
    }
    
    addSchema(path, schema) {
        this.schemas.set(path, schema.replace(/\s/g, ''));
    }

    setProtected(path, value = true) {
        if (value) this.protectedPaths.add(path);
        else this.protectedPaths.delete(path);
    }

    validateRequest(req) {
        let url = req.protocol + '://' + req.hostname + req.url;
        let path = new URL(url).pathname;

        if (this.protectedPaths.has(path) && !req.user.loggedIn) {
            throw new Error(errors.unauthorized);
        }
        if (!this.schemas.has(path)) return true;

        let schema = this.schemas.get(path);

        return this.validateObject(req.body, schema);
    }

    validate() {
        return (req, res, next) => {
            if (!this.validateRequest(req)) {
                throw new Error('invalid_request');
            }
            next();
        };
    }

    validateObject(body, schema) {
        schema = schema.replace(/\s/g, '');

        let i = 0;
        let char = schema[i];

        let parseObject = (parent, path = [], nulled = false) => {
            if (!nulled && typeof parent != 'object') {
                //console.log(path.join('.'), '- expected object');
                return false;
            }

            while ((char = schema[i]) && char != '}') {
                let key = '';
                while ((char = schema[++i]) && char != ':') {
                    if (char == '}') {
                        console.log('end');
                        break;
                    }
                    key += char;
                }

                if (key == '') break;

                let nullable = false;
                if (key.endsWith('?')) {
                    nullable = true;
                    key = key.slice(0, -1);
                }
                
                let type = '';
                while ((char = schema[++i]) && char != ',' && char != '}') {
                    if (char == '{') {
                        type = 'object';
                        break;
                    }
                    else if (type == '' && char == '[') {
                        type = 'array';
                        break;
                    }
                    type += char;
                }

                
                let arrayType = false;
                if (type != '[]' && type.endsWith('[]')) {
                    arrayType = true;
                    type = type.slice(0, -2);
                }

                let childNulled = nulled;

                let value = null;

                if (!nulled) {
                    value = parent[key];

                    if (value === undefined) {
                        if (nullable) {
                            parent[key] = null;
                            //console.log('nulled', path.concat(key).join('.'));
                            childNulled = true;
                        }
                        else {
                            //console.log(path.concat(key).join('.'), '- not found');
                            return false;
                        }
                    }
                    else if (value === null && !nullable) {
                        //console.log(path.concat(key).join('.'), '- expected', type, 'found null instead');
                        return false;
                    }
                    else if (arrayType) {
                        if (!(value instanceof Array)) {
                            //console.log(path.concat(key).join('.'), '- expected array found', (value === null ? 'null' : typeof value), 'instead');
                            return false;
                        }
            
                        for (let element of value) {
                            let elementType = typeof element;
            
                            if (element === null) elementType = 'null';
                            else if (element instanceof Array) elementType = 'array';
            
                            if (elementType != type) {
                                //console.log(path.concat(key).join('.'), '- expected', type, 'found', elementType, 'instead');
                                return false;
                            }
                        }
                    }
                    else {
                        let valueType = typeof value;
            
                        if (value === null) valueType = 'null';
                        else if (value instanceof Array) valueType = 'array';
            
                        if (valueType != type) {
                            //console.log(path.concat(key).join('.'), '- expected', type, 'found', valueType, 'instead');
                            return false;
                        }
                    }
                }

                if (type == 'object') {
                    if (!parseObject(value, path.concat(key), childNulled)) return false;
                    i++;
                }
                else if (type == 'array') {
                    parseArray(value, path.concat(key), childNulled);
                    i++;
                }
            }

            return true;
        };

        let parseArray = (parent, path = [], nulled = false) => {
            while ((char = schema[++i]) && char != ']') {
                if (char == '[') {
                    //console.log('array in array');
                    parseArray(parent, path.concat('[]'), nulled);
                }
                else if (char == '{') {
                    parseObject(parent, path.concat('[]'), nulled);
                }
            }
            return true;
        };

        if (char == '{')
            return parseObject(body);
        else if (char == '[')
            return parseArray(body);

        return false;
    }
}


module.exports = new RequestValidator();