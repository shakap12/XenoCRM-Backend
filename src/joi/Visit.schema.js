const Joi = require("joi");

const visitSchema = Joi.object({
    customerId: Joi.string().min(1).required(),
    source: Joi.string().required(),
});

module.exports = visitSchema;
