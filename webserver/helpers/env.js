const fs = require('fs');
const env = JSON.parse(fs.readFileSync('env.json'));

module.exports = env;