import { Consumer,Producer  } from 'kafkajs';
import { DocumentClassificationEvent  } from './types/document-classification-event';
import { config } from '../config';
import { resolveDocumentClassId } from './types/document-classification-mapping';

export async function waitForMessages(
  getBuffer: () => DocumentClassificationEvent[],
  shareId: string,
  expectedCount: number,
  timeoutMs?: number
): Promise<DocumentClassificationEvent[]> {
  const effectiveTimeout = timeoutMs ?? config.test.maxWaitForMessageMs;
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      clearInterval(interval);
      const matchingCount = getBuffer().filter(
        m => m.correlationId === shareId
      ).length;
      const totalBufferCount = getBuffer().length;
      reject(
        new Error(
          `Timeout waiting for messages. Expected: ${expectedCount}, Received: ${matchingCount} for shareId: ${shareId}. Total messages in buffer: ${totalBufferCount}`
        )
      );
    }, effectiveTimeout);

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
  return classifications.map(key => resolveDocumentClassId(key));
}

export function groupByCorrelationId(
  messages: DocumentClassificationEvent []
): Map<string, DocumentClassificationEvent []> {
  return messages.reduce((map, message) => {
    const existing = map.get(message.correlationId) ?? [];
    map.set(message.correlationId, [...existing, message]);
    return map;
  }, new Map<string, DocumentClassificationEvent []>());
}

export async function publishStubMessage(
  producer: Producer,
  shareId: string,
  documentClass: string
): Promise<void> {
  await producer.send({
    topic: config.kafka.topic,
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