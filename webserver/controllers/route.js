/*CREATE TABLE `routes` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `oppositeId` INT NULL DEFAULT NULL , 
    `departureLocation` INT NOT NULL , 
    `arrivalLocation` INT NOT NULL , 
    `hours` TEXT NULL DEFAULT NULL , 
    `stops` TEXT NULL DEFAULT NULL , 
    `prices` TEXT NULL DEFAULT NULL , 
    `distances` TEXT NULL DEFAULT NULL ,
    PRIMARY KEY (`id`)
);*/

let db = require('../configs/db');
let { getFirst, deleteProps, splitProps } = require('../helpers/query-utils');

module.exports.addRoute = (route) => {
    return db.query('INSERT INTO routes VALUES (?,?,?,?,?,?,?,?)', [
        null,
        route.oppositeId || null,
        route.departureLocation,
        route.arrivalLocation,
        route.hours.join(),
        route.stops.join(),
        route.prices.join(),
        route.distances.join()
    ]);
};

module.exports.findAllRoutes = () => {
    return db.query('SELECT * FROM routes')
        .then(splitProps('hours', 'stops', 'prices', 'distances'))
        .then((routes) => routes.map((route) => {
            route.prices = route.prices.map(parseFloat);
            route.distances = route.distances.map(parseFloat);
            return route;
        }));
};

module.exports.findRoute = (routeId) => {
    return db.query('SELECT * FROM routes WHERE id=? LIMIT 1', [routeId])
        .then(splitProps('hours', 'stops', 'prices', 'distances'))
        .then((routes) => routes.map((route) => {
            route.prices = route.prices.map(parseFloat);
            route.distances = route.distances.map(parseFloat);
            return route;
        }))
        .then(getFirst);
};

module.exports.updateRoute = (routeId, route) => {
    return db.query(`UPDATE routes
        SET oppositeId=?, departureLocation=?, arrivalLocation=?, hours=?, stops=?, prices=?, distances=?
        WHERE id=?`, [
            route.oppositeId || null,
            route.departureLocation,
            route.arrivalLocation,
            route.hours.join(),
            route.stops.join(),
            route.prices.join(),
            route.distances.join(),
            routeId
        ]
    );
};

module.exports.deleteRoute = (routeId) => {
    return db.query('DELETE FROM routes WHERE id=?', [routeId]);
};