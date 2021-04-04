const { unauthorized } = require('../errors');

module.exports = (...roleProrities) => (requiredRole) => (req, res, next) => {
    let userRole = req.user.role;
    let requiredPriority = roleProrities.find((pair) => pair[1] === requiredRole)[0];
    let userPriority = roleProrities.find((pair) => pair[1] === userRole)[0];

    if (userPriority < requiredPriority) {
        throw unauthorized();
    }

    next();
};