const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
  amount: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderSchema, "order");
