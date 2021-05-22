const { notFound } = require('../errors');
const { parseDateTime } = require('./date');
const { roleDictionary } = require('../middlewares/roles');

module.exports = {
    getFirst: (results) => {
        if (results instanceof Array && results.length > 0) return results[0];
        else throw notFound();
    },
    pullProp: (prop) => (results) => {
        return results.map((result) => result[prop]);
    },
    selectProps: (...props) => (results) => {
        if (!results || results.length == 0) return results;

        for (let prop in results[0]) {
            if (props.includes(prop)) continue;

            for (let result of results) {
                delete result[prop];    
            }
        }

        return results;
    },
    deleteProps: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                delete result[prop];
            }
        }
        
        return results;
    },
    renameProp: (prop, newName) => (results) => {
        for (let result of results) {
            result[newName] = result[prop];
            delete result[prop];
        }
        return results;
    },
    splitProps: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                if (result[prop].trim() === '') {
                    result[prop] = [];
                }
                else {
                    result[prop] = result[prop].split(',');
                }
            }
        }
        return results;
    },
    resolveBooleans: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                result[prop] = (result[prop] == 1);
            }
        }
        return results;
    },
    resolveRoles: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                result[prop] = roleDictionary.getRole(result[prop]).name;
            }
        }
        return results;
    },
    resolveDateTime: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                result[prop] = parseDateTime(result[prop]).toString();
            }
        }
        return results;
    },
    resolveDateTime3: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                result[prop] = parseDateTime(result[prop]).toString(3);
            }
        }
        return results;
    }
};