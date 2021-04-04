const { notFound } = require('../errors');

module.exports = {
    getFirst: (results) => {
        console.log('co');
        if (results instanceof Array && results.length > 0) return results[0];
        else throw notFound();
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
    }
};