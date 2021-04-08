const { notFound } = require('../errors');
const { parseDateTime } = require('./date');

module.exports = {
    getFirst: (results) => {
        if (results instanceof Array && results.length > 0) return results[0];
        else throw notFound();
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
    splitProps: (...props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                result[prop] = result[prop].split(',');
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
                result[prop] = (['guest', 'client', 'driver', 'office', 'owner'])[result[prop]];
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