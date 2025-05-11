const express = require("express");
const amqp = require("amqplib/callback_api");
const customerSchema = require("../joi/Customer.schema");
const Send = require("../rabbit/Send.class");
const customerController = require("../controllers/Customer.controller");

const router = express.Router();

router.post("/add", (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) {
    console.log(error)
    return res.status(400).send({
      error: error.details[0].message,
    });
  }
  const { name, email, age } = value;
  new Send("customer").execute({ name, email, age });

  return res.status(201).send({
    message: "User Created",
  });
});

router.get("/filter", async (req, res) => {
  try {
    const filters = JSON.parse(decodeURI(req.query.filters));
    const customers = await customerController.getFilteredCustomers(filters);
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" + err });
  }
});

module.exports = router;
