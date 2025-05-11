const mongoose = require('mongoose')
const CommunicationLog = require("../models/Communication.schema");
const Campaign = require("../models/Campaign.schema")

exports.addCommunicationLog = async (_communicationLog) => {
    const communicationLog = new CommunicationLog(_communicationLog);
    await communicationLog.save();
};

exports.getAllLogs = async () => {
    return await CommunicationLog.find().populate(['customerId', 'campaignId']).sort('-createdAt').exec()
}
exports.addBulkCommunicationLog = async (communicationLogs) => {
    return await CommunicationLog.insertMany(communicationLogs);
};



exports.updateBulkCommunicationLog = async (communicationLogs) => {
    const bulkOpsComms = communicationLogs.map(data => {
        return {
            updateOne: {
                filter: { _id: data.logId },
                update: { status: data.status }
            }
        };
    });

    const res = await CommunicationLog.bulkWrite(bulkOpsComms);

    const campaignStatusCounts = communicationLogs.reduce((acc, { campaignId, status }) => {
        if (!acc[campaignId]) {
            acc[campaignId] = { SENT: 0, FAILED: 0 };
        }
        if (status === 'SENT') {
            acc[campaignId].SENT += 1;
        } else if (status === 'FAILED') {
            acc[campaignId].FAILED += 1;
        }
        return acc;
    }, {});

    const bulkOpsCampaigns = Object.keys(campaignStatusCounts).map(campaignId => {
        const { SENT, FAILED } = campaignStatusCounts[campaignId];
        return {
            updateOne: {
                filter: { _id: campaignId },
                update: {
                    $inc: { sent: SENT, failed: FAILED }
                }
            }
        };
    });

    await Campaign.bulkWrite(bulkOpsCampaigns);
}
