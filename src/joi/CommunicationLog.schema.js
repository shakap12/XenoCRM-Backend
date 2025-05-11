const Joi = require('joi');

const communicationLogSchema = Joi.object({
    logId: Joi.string().required(),
    status: Joi.string().required(),
    customerId: Joi.string().required(),
    campaignId: Joi.string().required(),
});

module.exports = communicationLogSchema;
