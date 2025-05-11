const Campaign = require("../models/Campaign.schema");
const Customer = require("../models/Customer.schema");
const queryParser = require("../helpers/QueryParser.helper");
const axios = require('axios');
const templateParser = require("../helpers/TemplateParser.helper");

exports.executeSendMessage = async ({ payload }) => {
    const endpoints = []

    for (let item of payload) {
        let status = Math.random() < 0.9 ? 'SENT' : 'FAILED'

        if (status == 'SENT') {
            console.log("Message sent: '" + item.message + "' to " + item.email)
        } else {
            console.log("Message failed: '" + item.message + "' to " + item.email)
        }

        endpoints.push(`http://127.0.0.1:5000/communication/delivery-reciept?logId=${item.hookData.logId}&campaignId=${item.hookData.campaignId}&customerId=${item.hookData.customerId}&status=${status}`)
    }

    await axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
}


