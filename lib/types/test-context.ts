import { ClassificationMessage } from './classification-message';

export interface TestContext {
  shareId: string;
  expectedClassifications: string[];
  receivedMessages: ClassificationMessage[];
}