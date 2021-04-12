class RoleDictionary {
    constructor(roles) {
        this.rolesByName = new Map();
        this.rolesByPriority = new Map();

        for (let role of Object.values(roles)) {
            this.rolesByName.set(role.name, role);
            this.rolesByPriority.set(role.priority, role);
        }
    }

    getRole(query) {
        if (query instanceof Role) {
            return query;
        }
        else if (typeof query == 'number') {
            return this.getRoleByPriority(query);
        }
        else if (typeof query == 'string') {
            return this.getRoleByName(query);
        }

        return null;
    }

    getRoleByPriority(rolePriority) {
        return this.rolesByPriority.get(rolePriority);
    }

    getRoleByName(roleName) {
        return this.rolesByName.get(roleName);
    }
}

class Role {
    constructor(name, priority) {
        this.name = name;
        this.priority = priority;
    }
}

module.exports = { Role, RoleDictionary };