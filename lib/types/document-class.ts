import documentClasses from '../document-classes.json';

type DocumentClasses = typeof documentClasses;

export function resolveDocumentClassId(key: string): string {
  const entry = documentClasses[key as keyof DocumentClasses];
  if (!entry) {
    throw new Error(
      `Unknown document class: "${key}". Check lib/document-classes.json for valid values.`
    );
  }
  return entry.id;
}