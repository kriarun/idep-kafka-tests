import { Given, When, Then } from '@cucumber/cucumber';
import { getConsumer, getProducer } from '../lib/kafka.client';
import { waitForMessages, resolveDocumentClassIds, publishStubMessage } from '../lib/helpers';
import { DocumentClassificationScenarioState  } from '../lib/types/document-classification-scenario-state';
import { config } from '../config';
import assert from 'assert';
import { getMessageBuffer } from '../lib/kafka.client';

let context: DocumentClassificationScenarioState ;

Given('the Kafka consumer is ready', async () => {
  const consumer = getConsumer();
  assert.ok(consumer, 'Kafka consumer is not connected');
});

Given(
  'the document with shareId {string} is uploaded with classifications {string}',
  async (shareId: string, classificationsString: string) => {
    const expectedKeys = classificationsString.split(',').map(c => c.trim());
    const expectedIds = resolveDocumentClassIds(expectedKeys);

    context = {
      shareId,
      expectedClassifications: expectedIds,
      receivedMessages: []
    };

    for (const documentClass of expectedIds) {
      await publishStubMessage(getProducer(), shareId, documentClass);
    }
  }
);

When('all classification messages are received', async () => {
  context.receivedMessages = await waitForMessages(
    getMessageBuffer,
    context.shareId,
    context.expectedClassifications.length
  );
});

Then(
  'the classifications should contain {string}',
  async (classificationsString: string) => {
    const expectedKeys = classificationsString.split(',').map(c => c.trim());
    const expectedIds = resolveDocumentClassIds(expectedKeys);

    const receivedIds = context.receivedMessages.map(
      m => m.documentClass
    );

    const sortedExpected = [...expectedIds].sort();
    const sortedReceived = [...receivedIds].sort();

    assert.deepStrictEqual(
      sortedReceived,
      sortedExpected,
      `Classifications mismatch. Expected: ${sortedExpected.join(', ')} Received: ${sortedReceived.join(', ')}`
    );
  }
);