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
    PRIMARY KEY (`id`)
);*/

module.exports.addEntity = (entity) => {
    return db.query('INSERT INTO work_schedule VALUES (?,?,?,?,?,?,?)', [
        null,
        entity.employeeId,
        entity.date?.toString(),
        entity.startHour?.toString(),
        entity.endHour?.toString(),
        entity.label,
        entity.vehicleId || null
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

module.exports.updateEntity = (entityId, entity) => {
    return db.query(`UPDATE work_schedule
        SET startHour=?, endHour=?, label=?
        WHERE id=?`, [
            entity.startHour?.toString(),
            entity.endHour?.toString(),
            entity.label,
            entityId
        ]);
};

module.exports.deleteEntity = (entityId) => {
    return db.query('DELETE FROM work_schedule WHERE id=?', [entityId]);
};