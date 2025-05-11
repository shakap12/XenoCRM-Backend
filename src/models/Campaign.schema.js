const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    name: String,
    rules: Array,
    message: String,
    audienceSize: Number,
    executed: { type: Boolean, default: false },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    audience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("campaign", campaignSchema, "campaign");