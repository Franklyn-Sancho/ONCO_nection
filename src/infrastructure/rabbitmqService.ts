import amqplib, { Channel, Connection } from 'amqplib';

let rabbitChannel: Channel | null = null;
const QUEUE_NAME = 'emailQueue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const RETRY_INTERVAL_MS = 5000; // 5 seconds

export async function initRabbitMQ(): Promise<Channel> {
  let connection: Connection;
  while (!rabbitChannel) {
    try {
      connection = await amqplib.connect(RABBITMQ_URL);
      rabbitChannel = await connection.createChannel();
      await rabbitChannel.assertQueue(QUEUE_NAME, { durable: true });
      console.log('RabbitMQ connected and queue asserted');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
    }
  }

  return rabbitChannel;
}

export function getRabbitChannel(): Channel | null {
  return rabbitChannel;
}

export const RABBITMQ_QUEUE_NAME = QUEUE_NAME;



