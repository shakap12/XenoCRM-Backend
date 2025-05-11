const Joi = require("joi");

const customerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  age: Joi.number().required(),
});

module.exports = customerSchema;
