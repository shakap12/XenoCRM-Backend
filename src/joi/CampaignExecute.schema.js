const Joi = require('joi');

const campaignExecuteSchema = Joi.object({
    campaignId: Joi.string().required(),
});

module.exports = campaignExecuteSchema;
