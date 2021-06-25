function nullize(data, schema) {
    let isNullable = (schema.nullable === true);
    let hasDefault = ('default' in schema);

    let isUndefined = (data === undefined);
    let isNull = (data === null);
    let isNullish = isUndefined || isNull;
    

    if (hasDefault && isNullable && isNullish) return schema.default;

    if (schema.type === 'object') {
        if (isNullable && isNullish) {
            return null;
        }
        else if (isNullish) {
            data = { };
        }

        for (let key in schema.properties) {
            data[key] = nullize(data[key], schema.properties[key]);
        }

        return data;
    }
    else {
        if (isNullable && isNullish) return null; 
        
        return data;
    }
}


module.exports = nullize;