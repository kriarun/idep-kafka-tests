import { BeforeAll, AfterAll, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { connectConsumer, connectProducer, disconnectAll, clearMessageBuffer } from './lib/kafka.client';

setDefaultTimeout(30 * 1000);

BeforeAll(async () => {
  await connectProducer();
  await connectConsumer();
});

Before(async () => {
  clearMessageBuffer();
});

AfterAll(async () => {
  await disconnectAll();
});