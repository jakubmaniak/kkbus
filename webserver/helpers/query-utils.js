module.exports = {
    getFirst: (results) => results[0],
    deleteProps: (props) => (results) => {
        for (let result of results) {
            for (let prop of props) {
                delete result[prop];
            }
        }
        
        return results;
    }
};