const orderController = require("../controllers/Order.controller");

module.exports = function (payload) {
  if (payload != null) {
    let order = JSON.parse(payload.content.toString());
    orderController
      .addOrder(order)
      .then(() => {
        console.log(`[X] Order => New order from ${order.customerId} added.`);
      })
      .catch((ex) => {
        console.log(
          "[X] Order => Something went wrong while adding order: " + ex
        );
      });
  }
};
