import { BeforeAll, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { connectConsumer, connectProducer, disconnectAll, clearMessageBuffer } from './lib/kafka.client';

setDefaultTimeout(30 * 1000);

BeforeAll(async () => {
await connectConsumer(); console.log('Consumer ready — copy files to folder now. Waiting 5 minutes...'); await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000)); console.log('Starting tests...');
});

Before(async () => {
  clearMessageBuffer();
});

AfterAll(async () => {
  await disconnectAll();
});