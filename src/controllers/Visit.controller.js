const Visit = require("../models/Visit.schema");
const customerController = require('../controllers/Customer.controller')

exports.addVisit = async (visitData) => {
    const visit = new Visit(visitData);
    await visit.save();
    await customerController.updateVisit(visitData)
};

exports.getCities = async () => {
    return await Visit.find().populate("customerId");
};

exports.getVisitById = async (id) => {
    return await Visit.findById(id).populate("customerId");
};

exports.updateVisit = async (id, visitData) => {
    return await Visit.findByIdAndUpdate(id, visitData, { new: true });
};

exports.deleteVisit = async (id) => {
    return await Visit.findByIdAndDelete(id);
};
