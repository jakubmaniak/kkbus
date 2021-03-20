function translate(schema) {
    let model = { };

    schema = schema.replace(/\s/g, '');

    let i = 0;
    let char = schema[i];

    let parseObject = (parent) => {
        parent.type = 'object';
        parent.properties = {};
        parent.required = [];

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

            if (arrayType) {
                parent.properties[key] = { type: 'array', items: { type } };
            }
            else if (type == 'object') {
                parent.properties[key] = { };
                parseObject(parent.properties[key]);
                i++;
            }
            else if (type == 'array') {
                parent.properties[key] = { };
                parseArray(parent.properties[key]);

                i++;
            }
            else {
                parent.properties[key] = { type };
            }

            if (!nullable) parent.required.push(key);
            else parent.properties[key].type = [type, 'null'];
        }
    };

    let parseArray = (parent) => {
        parent.type = 'array';

        while ((char = schema[++i]) && char != ']') {
            if (char == '[') {
                parseArray(parent, path.concat('[]'), nulled);
            }
            else if (char == '{') {
                parseObject(parent, path.concat('[]'), nulled);
            }
        }
    };

    if (char == '{') {
        parseObject(model);
    }
    else if (char == '[') {
        parseArray(model);
    }

    return model;
}


module.exports = { translate };