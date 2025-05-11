const Campaign = require("../models/Campaign.schema");
const Customer = require("../models/Customer.schema");
const CommuncationController = require("../controllers/Communication.controller")

const queryParser = require("../helpers/QueryParser.helper");
const axios = require('axios');
const templateParser = require("../helpers/TemplateParser.helper");

exports.createCampaign = async (campaignData) => {
    const { name, rules, message } = campaignData;
    const query = queryParser.buildQuery(rules);

    const audience = await Customer.find(query);
    const audienceSize = audience.length;

    const campaign = new Campaign({
        name,
        rules,
        message,
        audienceSize,
        audience: audience.map(customer => customer._id)
    });

    await campaign.save();

    return campaign;
};

exports.executeCampaign = async ({ campaignId }) => {
    const campaign = await Campaign.findById(campaignId).populate('audience');

    if (!campaign.executed) {
        const payload = [];
        const communicationLogs = [];

        for (let customer of campaign.audience) {
            const personalizedMessage = templateParser.replaceTemplate(campaign.message, { name: customer.name, age:customer.age, totalSpent:customer.totalSpent });
            const hookData = {
                campaignId: campaignId,
                customerId: customer._id
            };

            const logEntry = {
                ...hookData,
                status: 'PENDING',
                email: customer.email,
                message: personalizedMessage
            };

            communicationLogs.push(logEntry);
        }

        const insertedLogs = await CommuncationController.addBulkCommunicationLog(communicationLogs)

        insertedLogs.forEach((log, index) => {
            const hookData = {
                logId: log._id,
                campaignId: log.campaignId,
                customerId: log.customerId
            };

            payload.push({
                email: log.email,
                message: log.message,
                hookData: hookData
            });
        });

        await axios.post('http://127.0.0.1:5000/vendor/send', { payload: payload });

        await Campaign.findOneAndUpdate({ _id: campaign._id }, { executed: true })
    }

}

exports.getCampaigns = async () => {
    // const campaigns = await Campaign.find().populate('audience');
    const campaigns = await Campaign.find().populate('audience').sort('-createdAt').exec()
    return campaigns;
};

