const { unauthorized } = require('../errors');
const { Role, RoleDictionary } = require('../helpers/role');

module.exports.roles = {
    guest: new Role('guest', 0),
    client: new Role('client', 1),
    driver: new Role('driver', 2),
    office: new Role('office', 3),
    owner: new Role('owner', 4)
};

module.exports.roleDictionary = new RoleDictionary(this.roles);

module.exports.onlyRoles = (...allowedRoles) => (req, res, next) => {
    let userRole = req.user.role;
    
    for (let role of allowedRoles) {
        role = this.roleDictionary.getRole(role);
        if (role.priority == userRole.priority) {
            return next();
        }
    }

    throw unauthorized();
};

module.exports.minimumRole = (role) => (req, res, next) => {
    let userRole = req.user.role;

    role = this.roleDictionary.getRole(role);
    if (role.priority <= userRole.priority) {
        return next();
    }

    throw unauthorized();
};

module.exports.maximumRole = (role) => (req, res, next) => {
    let userRole = req.user.role;
    
    role = this.roleDictionary.getRole(role);
    if (role.priority >= userRole.priority) {
        return next();
    }

    throw unauthorized();
};