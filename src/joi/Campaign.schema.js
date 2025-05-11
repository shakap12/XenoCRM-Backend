const Joi = require('joi');

const campaignSchema = Joi.object({
    name: Joi.string().required(),
    rules: Joi.array().items(Joi.object({
        id: Joi.number(),
        field: Joi.string().required(),
        operator: Joi.string().required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        logicalOperator: Joi.string().valid('AND', 'OR').required()
    })).required(),
    message: Joi.string().required()
});

module.exports = campaignSchema;
