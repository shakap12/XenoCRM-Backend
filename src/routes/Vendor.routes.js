const express = require("express");
const vendorPayloadSchema = require("../joi/VendorPayload.schema");
const VendorController = require('../controllers/Vendor.controller')

const Send = require("../rabbit/Send.class");
const { default: axios } = require("axios");

const router = express.Router();

router.post("/send", async (req, res) => {
    const { error, value } = vendorPayloadSchema.validate(req.body);
    if (error) {
        return res.status(400).send({
            error: error.details[0].message,
        });
    }
    try {
        await VendorController.executeSendMessage(value)
        res.status(200).json({ message: "Sent succefully" });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Internal Server Error " + err });
    }

});

module.exports = router;
