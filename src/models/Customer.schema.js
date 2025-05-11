const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  totalSpent: { type: Number, default: 0 },
  totalVisits: { type: Number, default: 1 },
  lastVisit: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("customer", customerSchema, "customer");
