let db = require('../configs/db');
const { parseDate } = require('../helpers/date');
let { getFirst, splitProps, resolveRoles, resolveBooleans } = require('../helpers/query-utils');

/*CREATE TABLE `availability`(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `employeeId` INT NOT NULL ,
    `date` VARCHAR(10) NOT NULL ,
    `startHour` VARCHAR(5) NOT NULL ,
    `endHour` VARCHAR(5) NOT NULL ,
    `label` TEXT NOT NULL ,
    PRIMARY KEY (`id`)
);*/

module.exports.addEntity = (entity) => {
    return db.query('INSERT INTO availability VALUES (?,?,?,?,?,?)', [
        null,
        entity.employeeId,
        entity.date?.toString(),
        entity.startHour?.toString(),
        entity.endHour?.toString(),
        entity.label
    ]);
};

module.exports.findAllEntities = () => {
    return db.query(`SELECT availability.*, users.role, users.firstName, users.lastName
        FROM availability
        LEFT JOIN users ON availability.employeeId = users.id`);
};

module.exports.findManyEntitiesByDate = (date) => {
    return db.query(`SELECT availability.*, users.role, users.firstName, users.lastName
        FROM availability
        LEFT JOIN users ON availability.employeeId = users.id
        WHERE availability.date=?`, [date?.toString()]);
};

module.exports.findManyEntitiesByDateRange = (startDate, endDate) => {
    return db.query(`SELECT availability.*, users.role, users.firstName, users.lastName
        FROM availability
        LEFT JOIN users ON availability.employeeId = users.id
        WHERE availability.date >= ? AND availability.date <= ?`, [
            startDate?.toString(),
            endDate?.toString()
        ]);
};

module.exports.updateEntity = (entityId, entity) => {
    entity = { ...entity };

    if ('startHour' in entity) {
        entity.startHour = entity.startHour?.toString();
    }

    if ('endHour' in entity) {
        entity.endHour = entity.endHour?.toString();
    }

    for (let key in entity) {
        if (entity[key] == null) {
            delete entity[key];
        }
    }

    let columns = Object.entries(entity).flat();

    return db.query(`UPDATE availability
        SET ${Object.entries(entity).map(() => '??=?').join(', ')}
        WHERE id=?`, [
            ...columns,
            entityId
        ]);
};

module.exports.deleteEntity = (entityId) => {
    return db.query('DELETE FROM availability WHERE id=?', [entityId]);
};