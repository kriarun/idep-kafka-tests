import { DocumentClassificationEvent } from './document-classification-event';

export interface DocumentClassificationScenarioState   {
  shareId: string;
  expectedClassifications: string[];
  receivedMessages: DocumentClassificationEvent[];
}