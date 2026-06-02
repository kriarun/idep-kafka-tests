export interface ClassificationMessage {
  eventType: string;
  namespace: string;
  correlationId: string;
  documentClass: string;
  documentClassifierConfidence: number;
  classifiedDocumentId: string;
  ingestedDocumentId: string;
  storageId: string;
}