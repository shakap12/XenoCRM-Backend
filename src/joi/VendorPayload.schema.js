const Joi = require('joi');

const vendorPayloadSchema = Joi.object({
    payload: Joi.array().items(Joi.object({
        email: Joi.string().required(),
        message: Joi.string().required(),
        hookData: {
            logId: Joi.string().required(),
            customerId: Joi.string().required(),
            campaignId: Joi.string().required(),
        }
    })).required()
});

module.exports = vendorPayloadSchema;

