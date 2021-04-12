const express = require('express');
const router = express.Router();

const { serverError } = require('../errors');
const bodySchema = require('../middlewares/body-schema');
const { minimumRole } = require('../middlewares/roles');
const contactController = require('../controllers/contact');


let cachedContact = {
    address: null,
    zipCode: null,
    phoneNumber: null,
    faxNumber: null,
    email: null
};

contactController.findContact()
.then((contact) => cachedContact = contact);


router.get('/contact', (req, res) => {
    res.ok(cachedContact);
});

router.put('/contact', [
    minimumRole('owner'),
    bodySchema(`{
        address: string,
        zipCode: string,
        phoneNumber: string,
        faxNumber?: string,
        email: string
    }`)
], async (req, res, next) => {
    let { address, zipCode, phoneNumber, faxNumber, email } = req.body;

    let contact = {
        address,
        zipCode,
        phoneNumber,
        faxNumber,
        email
    };

    try {
        await contactController.updateContact(contact);
    }
    catch {
        return next(serverError());
    }
    
    cachedContact = contact;
    res.ok(contact);
});


module.exports = router;