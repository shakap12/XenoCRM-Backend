const express = require("express");
const Send = require("../rabbit/Send.class");
const communicationController = require("../controllers/Communication.controller");
const communicationLogSchema = require("../joi/CommunicationLog.schema");

const router = express.Router();

router.get("/delivery-reciept", async (req, res) => {
    const { error, value } = communicationLogSchema.validate(req.query);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    try {
        new Send("communication_log").execute(value);
        res.status(200).send({ message: "Updated" })
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const logs = await communicationController.getAllLogs()
        res.status(200).send(logs)
    } catch (err) {
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
