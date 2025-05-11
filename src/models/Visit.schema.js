const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
  source: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("visit", visitSchema, "visit");
