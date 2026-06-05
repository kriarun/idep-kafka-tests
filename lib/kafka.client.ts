import { Kafka, Consumer, Producer, logLevel } from 'kafkajs';
import { config } from '../config';
import { DocumentClassificationEvent  } from './types/document-classification-event';

let kafka: Kafka;
let consumer: Consumer;
let producer: Producer;
const messageBuffer: DocumentClassificationEvent [] = [];

function createKafkaInstance(): Kafka {
  const isLocal = !config.kafka.username;

  if (isLocal) {
    return new Kafka({
      brokers: [config.kafka.brokerUrl],
      logLevel: logLevel.ERROR
    });
  }

  return new Kafka({
    brokers: [config.kafka.brokerUrl],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: config.kafka.username,
      password: config.kafka.password
    },
    logLevel: logLevel.ERROR
  });
}



export async function connectProducer(): Promise<void> {
  if (!kafka) {
    kafka = createKafkaInstance();
  }
  producer = kafka.producer();
  await producer.connect();
}

export async function disconnectAll(): Promise<void> {
  await consumer?.disconnect();
  await producer?.disconnect();
}

export function getConsumer(): Consumer {
  return consumer;
}

export function getProducer(): Producer {
  return producer;
}

export async function connectConsumer(): Promise<void> {
  kafka = createKafkaInstance();
  consumer = kafka.consumer({ groupId: config.kafka.groupId });
  await consumer.connect();
  await consumer.subscribe({
    topic: config.kafka.topic,
    fromBeginning: false
  });

  // Start consuming immediately — buffer all messages
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const parsed: DocumentClassificationEvent  = JSON.parse(
        message.value.toString()
      );
      messageBuffer.push(parsed);
    }
  });
}

export function getMessageBuffer(): DocumentClassificationEvent [] {
  return messageBuffer;
}

export function clearMessageBuffer(): void {
  messageBuffer.length = 0;
}