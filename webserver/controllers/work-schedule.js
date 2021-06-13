let db = require('../configs/db');
let { getFirst, splitProps } = require('../helpers/query-utils');

/*CREATE TABLE `work_schedule` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `employeeId` INT NOT NULL,
    `date` VARCHAR(10) NOT NULL, 
    `startHour` VARCHAR(5) NOT NULL, 
    `endHour` VARCHAR(5) NOT NULL, 
    `label` TEXT NOT NULL, 
    `vehicleId` INT NULL DEFAULT NULL, 
    `routeId` INT NULL DEFAULT NULL,
    `parking` TEXT NULL DEFAULT NULL
    PRIMARY KEY (`id`)
);*/

module.exports.addEntity = (entity) => {
    return db.query('INSERT INTO work_schedule VALUES (?,?,?,?,?,?,?,?,?)', [
        null,
        entity.employeeId,
        entity.date?.toString(),
        entity.startHour?.toString(),
        entity.endHour?.toString(),
        entity.label,
        entity.vehicleId || null,
        entity.routeId || null,
        entity.parking || null
    ]);
};

module.exports.findAllEntities = () => {
    return db.query(`SELECT work_schedule.*, users.role, users.firstName, users.lastName
        FROM work_schedule
        LEFT JOIN users ON work_schedule.employeeId = users.id`);
};

module.exports.findManyEntitiesByDate = (date) => {
    return db.query(`SELECT work_schedule.*, users.role, users.firstName, users.lastName
        FROM work_schedule
        LEFT JOIN users ON work_schedule.employeeId = users.id
        WHERE work_schedule.date=?`, [date?.toString()]);
};

module.exports.findManyEntitiesByDateRange = (startDate, endDate) => {
    return db.query(`SELECT work_schedule.*, users.role, users.firstName, users.lastName
        FROM work_schedule
        LEFT JOIN users ON work_schedule.employeeId = users.id
        WHERE work_schedule.date >= ? AND work_schedule.date <= ?`, [
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

    return db.query(`UPDATE work_schedule
        SET ${Object.entries(entity).map(() => '??=?').join(', ')}
        WHERE id=?`, [
            ...columns,
            entityId
        ]);
};

module.exports.deleteEntity = (entityId) => {
    return db.query('DELETE FROM work_schedule WHERE id=?', [entityId]);
};