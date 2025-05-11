const Order = require("../models/Order.schema");
const customerController = require('../controllers/Customer.controller')

exports.addOrder = async (_order) => {
  const { customerId, amount } = _order;
  await customerController.updateOrder(_order)
  const order = new Order({ customerId, amount });
  await order.save();
};

exports.getAll = async () => {
  return await Order.find().populate('customerId').sort('-date').exec()
}