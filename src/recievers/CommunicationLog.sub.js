const customerController = require("../controllers/Customer.controller");
const communcationController = require("../controllers/Communication.controller");

const BATCH_SIZE = 5;
const BATCH_INTERVAL = 10000;

let messages = []


const rootConsumer = async (payload) => {
    if (payload != null) {
        let log = JSON.parse(payload.content.toString());
        messages.push(log)

        if (messages.length >= BATCH_SIZE) {
            updateStatus(messages);
            messages = [];
        }
    }
}

const timerConsumer = () => {
    setInterval(async () => {
        if (messages.length > 0) {
            updateStatus(messages)
            messages = []
        }
    }, BATCH_INTERVAL);
}


const updateStatus = async (messages) => {
    try {
        await communcationController.updateBulkCommunicationLog(messages)
        console.log("Updated status: " + messages.length)
    } catch (err) {
        console.log("Error updating log status: " + err)
    }
}

module.exports = {
    rootConsumer,
    timerConsumer
}