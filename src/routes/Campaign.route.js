const express = require('express');
const campaignController = require('../controllers/Campaign.controller');
const campaignSchema = require('../joi/Campaign.schema');
const campaignExecuteSchema = require('../joi/CampaignExecute.schema');

const router = express.Router();

router.post('/add', async (req, res) => {
    const { error, value } = campaignSchema.validate(req.body);
    if (error) {
        return res.status(400).send({
            error: error.details[0].message
        });
    }

    try {
        const campaign = await campaignController.createCampaign(value);
        return res.status(201).send(campaign);
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
});

router.post('/execute', async (req, res) => {
    const { error, value } = campaignExecuteSchema.validate(req.body);
    if (error) {
        return res.status(400).send({
            error: error.details[0].message
        });
    }

    try {
        const campaign = await campaignController.executeCampaign(value);
        return res.status(201).send({ message: "Campaign executed" });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: err
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const campaigns = await campaignController.getCampaigns();
        return res.status(200).send(campaigns);
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
});

module.exports = router;
