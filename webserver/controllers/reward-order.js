let db = require('../configs/db');

/*
CREATE TABLE `reward_orders` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `userId` INT NOT NULL ,
    `rewardId` INT NOT NULL , 
    `points` INT UNSIGNED NOT NULL , 
    `orderDate` DATETIME NOT NULL , 
    `realizationDate` DATETIME NULL , 
    `shipmentDate` DATETIME NULL , 
     PRIMARY KEY (`id`)
);
*/

module.exports.addOrder = (order) => {
    return db.query('INSERT INTO reward_orders VALUES (?,?,?,?,?,?,?)', [
        null,
        order.userId,
        order.rewardId,
        order.points,
        order.orderDate?.toString(),
        order.realizationDate?.toString(),
        order.shipmentDate?.toString()
    ]);
};

module.exports.findAllOrders = ({ shipped = null, realized = null, op = 'AND' } = { }) => {
    let conditions = [];
    
    if (shipped !== null) {
        conditions.push('shipmentDate IS ' + (shipped ? 'NOT NULL' : 'NULL'));
    }

    if (realized !== null) {
        conditions.push('realizationDate IS ' + (realized ? 'NOT NULL' : 'NULL'));
    }

    if (conditions.length > 0) {
        return db.query('SELECT * FROM reward_orders WHERE ' + conditions.join(` ${op} `));
    }

    return db.query('SELECT * FROM reward_orders');
};

module.exports.findUserOrders = (userId, { shipped = null, realized = null, op = 'AND' } = { }) => {
    let conditions = [];
    
    if (shipped !== null) {
        conditions.push('shipmentDate IS ' + (shipped ? 'NOT NULL' : 'NULL'));
    }

    if (realized !== null) {
        conditions.push('realizationDate IS ' + (realized ? 'NOT NULL' : 'NULL'));
    }

    if (conditions.length > 0) {
        return db.query(`SELECT * FROM reward_orders
            WHERE userId=? AND ` + conditions.join(` ${op} `), [
                userId
            ]
        );
    }

    return db.query('SELECT * FROM reward_orders WHERE userId=?', [userId]);
};

module.exports.updateOrder = (orderId, order) => {
    return db.query(`UPDATE reward_orders
        SET userId=?, rewardId=?, points=?, orderDate=?, realizationDate=?, shipmentDate=?
        WHERE id=?`, [
            order.userId,
            order.rewardId,
            order.points,
            order.orderDate?.toString(),
            order.realizationDate?.toString(),
            order.shipmentDate?.toString(),
            orderId
        ]
    );
};