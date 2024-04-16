import amqplib, { Channel, Connection } from "amqplib";

// rabbitmq to be global variables
let channel: Channel, connection: Connection;

connect();

async function connect() {
  try {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    // consume all the orders that are not acknowledged
    await channel.consume("order", (data) => {
      console.log(`Received ${Buffer.from(data!.content)}`);
      channel.ack(data!);
    });
  } catch (error) {
    console.log(error);
  }
}
