const amqp = require("amqplib/callback_api.js");

class Receive {
  constructor(queueName = "mediumQueue") {
    this.rabbit = amqp;
    this.queueName = queueName;
  }

  execute(consumer) {
    const rabbitUrl = process.env.RABBIT_URL_AWS;

    const connectionOptions = rabbitUrl || {
      protocol: 'amqp',
      hostname: '127.0.0.1',
      port: 5672,
      username: 'guest',
      password: 'guest',
    };

    console.log("🐇 Connecting to RabbitMQ:", rabbitUrl || "localhost");

    this.rabbit.connect(connectionOptions, (error, connection) => {
      if (error) {
        console.error("❌ RabbitMQ connection failed:", error.message);
        return;
      }

      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error("❌ Failed to create channel:", error1.message);
          return;
        }

        channel.assertQueue(this.queueName, { durable: true });

        channel.consume(this.queueName, consumer, {
          noAck: true,
        });

        console.log(`✅ RabbitMQ Connected. Listening on queue: ${this.queueName}`);
      });
    });
  }
}

module.exports = Receive;
