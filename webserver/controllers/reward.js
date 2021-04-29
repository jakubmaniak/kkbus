/*
CREATE TABLE ``rewards` (
    `id` INT NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(250) NOT NULL ,
    `requiredPoints` INT NOT NULL ,
    `amount` INT NULL DEFAULT NULL,
    `limitPerUser` INT NULL DEFAULT NULL, 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;
*/

let db = require('../configs/db');
const { renameProp, getFirst } = require('../helpers/query-utils');


module.exports.addReward = (reward) => {
    return db.query('INSERT INTO rewards VALUES (?,?,?,?,?)', [
        null,
        reward.name,
        reward.requiredPoints,
        reward.amount,
        reward.limit
    ]);
};

module.exports.findAllRewards = () => {
    return db.query('SELECT * FROM rewards')
        .then(renameProp('limitPerUser', 'limit'));
};

module.exports.findReward = (rewardId) => {
    return db.query('SELECT * FROM rewards WHERE id=?', [rewardId])
        .then(renameProp('limitPerUser', 'limit'))
        .then(getFirst());
};

module.exports.updateReward = (rewardId, reward) => {
    return db.query(`UPDATE rewards
        SET name=?, requiredPoints=?, amount=?, limitPerUser=?
        WHERE id=?`, [
            reward.name,
            reward.requiredPoints,
            reward.amount,
            reward.limit,
            rewardId
        ]
    );
};

module.exports.deleteReward = (rewardId) => {
    return db.query('DELETE FROM rewards WHERE id=?', [rewardId]);
};