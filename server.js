const express = require("express");
const bodyParser = require("body-parser");
var morgan = require('morgan');
var cors = require('cors')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const customerRouter = require("./src/routes/Customer.route");
const campaignRouter = require("./src/routes/Campaign.route");
const communcationRouter = require('./src/routes/Communication.route')
const orderRouter = require("./src/routes/Order.route")
const vendorRouter = require('./src/routes/Vendor.routes')
const visitRouter = require("./src/routes/Visit.route")

const customerConsumer = require("./src/recievers/Customer.sub");
const orderConsumer = require("./src/recievers/Order.sub");
const communcationLogConsumer = require("./src/recievers/CommunicationLog.sub")
const Receive = require("./src/rabbit/Recieve.class");

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000;
const aiRoutes = require('./src/routes/ai.route');


app.use("/customer", customerRouter);
app.use("/campaign", campaignRouter)
app.use("/communication", communcationRouter)
app.use("/order", orderRouter)
app.use("/vendor", vendorRouter)
app.use("/visit", visitRouter)
app.use('/ai', aiRoutes);
app.use("/", (req, res) => {
  res.json({
    message: "Server up and running"
  })
})

mongoose.pluralize(null);

mongoose.connect(process.env.MONGO_URL).then(() => {

  console.log("Database connected");
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    //app._router.stack.forEach(print.bind(null, []))

    new Receive("customer").execute(customerConsumer);
    new Receive("order").execute(orderConsumer);
    new Receive("communication_log").execute(communcationLogConsumer.rootConsumer)
    communcationLogConsumer.timerConsumer()
  });
});


function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}
