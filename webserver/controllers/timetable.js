let db = require('../configs/db');
let { getFirst, splitProps, resolveRoles, resolveBooleans } = require('../helpers/query-utils');

/*
CREATE TABLE `VdWUtFNeZC`.`timetable` (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `userId` INT NOT NULL , 
    `available` BOOLEAN NOT NULL , 
    `label` TEXT NULL , 
    `startDate` VARCHAR(10) NOT NULL , 
    `days` SMALLINT UNSIGNED NOT NULL , 
    `ranges` TEXT NOT NULL , 
    PRIMARY KEY (`id`)
);
*/

function groupAvailabilities(items) {
    return items.reduce((array, item) => {
        let parent = array.find((i) => i.userId == item.userId);

        if (!parent) {
            parent = {
                userId: item.userId,
                name: item.firstName + ' ' + item.lastName,
                role: item.role,
                items: []
            };

            array.push(parent);
        }

        parent.items.push({
            id: item.id,
            available: item.available,
            label: item.label,
            startDate: item.startDate,
            days: item.days,
            ranges: item.ranges
        });

        return array;
    }, []);
}

module.exports.addAvailability = (availability) => {
    return db.query('INSERT INTO timetable VALUES (?,?,?,?,?,?,?)', [
        null,
        availability.userId,
        availability.available,
        availability.label || null,
        availability.startDate,
        availability.days,
        availability.ranges.join()
    ]);
};

module.exports.findAllAvailabilities = () => {
    return db.query(`SELECT timetable.*, users.role, users.firstName, users.lastName
        FROM timetable
        LEFT JOIN users
        ON timetable.userId=users.id
        ORDER BY users.role DESC, users.lastName, users.firstName, timetable.startDate`
    )
    .then(splitProps('ranges'))
    .then(resolveRoles('role'))
    .then(resolveBooleans('available'))
    .then(groupAvailabilities);
};

module.exports.updateAvailability = (availabilityId, availability) => {
    return db.query(`UPDATE timetable
        SET available=?, label=?, startDate=?, days=?, ranges=?
        WHERE id=?`, [
            availability.available,
            availability.label,
            availability.startDate,
            availability.days,
            availability.ranges,
            availabilityId
        ]
    );
};

// module.exports.findAllAvailabilitiesByRoles = (roles) => {
//     return db.query(`SELECT timetable.*, users.role, users.firstName, users.lastName
//         FROM timetable
//         LEFT JOIN users
//         ON timetable.userId=users.id`
//     );
// };