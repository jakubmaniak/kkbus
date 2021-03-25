let db = require('../configs/db');
let { getFirst, deleteProps } = require('../helpers/query-utils');

db.query(`CREATE TABLE IF NOT EXISTS contact (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(200) NULL,
    zipCode VARCHAR(200) NULL,
    phoneNumber VARCHAR(150) NULL,
    faxNumber VARCHAR(150) NULL,
    email VARCHAR(150) NULL
)`)
.then(() => {
    db.query(`INSERT INTO contact (id)
        SELECT 1
        WHERE NOT EXISTS (SELECT * FROM contact)
        LIMIT 1
    `)
    .then((ok) => {
        if (ok.affectedRows != 0) {
            console.log('Inserted a row into `contact`');
        }
    });
});

module.exports.findContact = () => {
    return db.query('SELECT * FROM contact LIMIT 1')
        .then(deleteProps('id'))
        .then(getFirst);
};

module.exports.updateContact = (contact) => {
    return db.query('UPDATE contact SET address=?, zipCode=?, email=?, phoneNumber=?, faxNumber=?', [
        contact.address,
        contact.zipCode,
        contact.email,
        contact.phoneNumber,
        contact.faxNumber
    ]);
};