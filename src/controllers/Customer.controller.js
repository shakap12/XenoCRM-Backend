const Customer = require("../models/Customer.schema");
const { buildQuery } = require("../helpers/QueryParser.helper");

exports.addCustomer = async (_customer) => {
  const { name, email, age } = _customer;
  const customer = new Customer({ name, email, age });
  await customer.save();
};

exports.updateOrder = async (_order) => {
  const { amount, customerId } = _order
  const customer = await Customer.findById(customerId)

  await Customer.updateOne({ _id: customerId }, {
    totalSpent: customer.totalSpent + amount
  })
}

exports.updateVisit = async (_order) => {
  const { customerId } = _order
  const customer = await Customer.findById(customerId)

  await Customer.updateOne({ _id: customerId }, {
    totalVisits: customer.totalVisits + 1,
    lastVisit: Date.now()
  })
}

exports.getFilteredCustomers = async (filters) => {
  const query = buildQuery(filters);
  return await Customer.find(query);
};
