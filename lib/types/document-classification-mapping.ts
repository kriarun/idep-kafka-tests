import documentClasses from '../document-classification-mapping.json';

type DocumentClasses = typeof documentClasses;

export function resolveDocumentClassId(key: string): string {
  const entry = documentClasses[key as keyof DocumentClasses];
  if (!entry) {
    throw new Error(
      `Unknown document class: "${key}". Check lib/document-classification-mapping.json for valid values.`
    );
  }
  return entry.id;
}