import { Consumer,Producer  } from 'kafkajs';
import { ClassificationMessage } from './types/classification-message';
import { DocumentClass, DocumentClassKey } from './types/document-class';
import { config } from '../config';

export async function waitForMessages(
  getBuffer: () => ClassificationMessage[],
  shareId: string,
  expectedCount: number
): Promise<ClassificationMessage[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearInterval(interval);
      reject(
        new Error(
          `Timeout waiting for messages. Expected: ${expectedCount}, Received: ${getBuffer().filter(m => m.correlationId === shareId).length} for shareId: ${shareId}`
        )
      );
    }, config.test.waitTimeoutMs);

    const interval = setInterval(() => {
      const received = getBuffer().filter(
        m => m.correlationId === shareId
      );
      if (received.length >= expectedCount) {
        clearTimeout(timer);
        clearInterval(interval);
        resolve(received);
      }
    }, 500);
  });
}
export function resolveDocumentClassIds(
  classifications: string[]
): string[] {
  return classifications.map(key => {
    const id = DocumentClass[key as DocumentClassKey];
    if (!id) {
      throw new Error(
        `Unknown document class: ${key}. Check document-class.ts for valid values.`
      );
    }
    return id;
  });
}

export function groupByCorrelationId(
  messages: ClassificationMessage[]
): Map<string, ClassificationMessage[]> {
  return messages.reduce((map, message) => {
    const existing = map.get(message.correlationId) ?? [];
    map.set(message.correlationId, [...existing, message]);
    return map;
  }, new Map<string, ClassificationMessage[]>());
}

export async function publishStubMessage(
  producer: Producer,
  shareId: string,
  documentClass: string
): Promise<void> {
  await producer.send({
    topic: config.kafka.topicB,
    messages: [
      {
        key: shareId,
        value: JSON.stringify({
          eventType: 'CLASSIFICATION_COMPLETED',
          namespace: 'idep',
          correlationId: shareId,
          documentClass,
          documentClassifierConfidence: 0.98,
          classifiedDocumentId: `classified-${shareId}`,
          ingestedDocumentId: `ingested-${shareId}`,
          storageId: `storage-${shareId}`
        })
      }
    ]
  });
}