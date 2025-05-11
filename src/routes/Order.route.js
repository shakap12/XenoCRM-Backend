const express = require("express");
const orderSchema = require("../joi/Order.schema");
const Send = require("../rabbit/Send.class");
const OrderController = require('../controllers/Order.controller')


const router = express.Router();

router.post("/add", (req, res) => {
  const { error, value } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }

  const { customerId, amount } = value;
  new Send("order").execute({ customerId, amount });

  return res.status(201).send({
    message: "Order Created",
  });
});

router.get("/", async (req, res) => {
  const orders = await OrderController.getAll()
  res.status(200).json(orders)
});

module.exports = router;
