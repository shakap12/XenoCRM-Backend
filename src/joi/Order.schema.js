const Joi = require('joi');

const orderSchema = Joi.object({
    customerId: Joi.string().required(),
    amount: Joi.number().positive().required()
});

module.exports = orderSchema;