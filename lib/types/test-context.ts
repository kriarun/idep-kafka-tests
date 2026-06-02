import { ClassificationMessage } from './classification-message';

export interface TestContext {
  shareId: string;
  fileName: string;
  expectedClassifications: string[];
  receivedMessages: ClassificationMessage[];
}