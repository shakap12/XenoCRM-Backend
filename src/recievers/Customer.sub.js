const customerController = require("../controllers/Customer.controller");

module.exports = function (payload) {
  if (payload != null) {
    let customer = JSON.parse(payload.content.toString());
    customerController
      .addCustomer(customer)
      .then(() => {
        console.log(`[X] Customer => New customer(${customer.name}) added.`);
      })
      .catch((ex) => {
        console.log(
          "[X] Customer => Something went wrong while adding customer: " + ex
        );
      });
  }
};
