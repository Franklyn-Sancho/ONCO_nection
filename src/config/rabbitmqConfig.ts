import amqplib, { Channel, Connection } from 'amqplib';

let rabbitChannel: Channel | null = null;
const QUEUE_NAME = 'emailQueue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

export async function initRabbitMQ(): Promise<Channel> {
  try {
    const connection: Connection = await amqplib.connect(RABBITMQ_URL);
    rabbitChannel = await connection.createChannel();
    await rabbitChannel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('RabbitMQ connected and queue asserted');
    
    return rabbitChannel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error; // Re-throw the error to handle it in the caller
  }
}

export function getRabbitChannel(): Channel | null {
  return rabbitChannel;
}

export const RABBITMQ_QUEUE_NAME = QUEUE_NAME;

