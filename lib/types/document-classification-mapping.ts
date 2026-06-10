import idepDoctypeList from '../idep_doctype_list.json';

export function resolveDocumentClassId(key: string): string {
  const entry = idepDoctypeList.data.find(
    d => d.docTypeName === key
  );
  if (!entry) {
    throw new Error(
      `Unknown document type: "${key}". Check lib/idep_doctype_list.json for valid values.`
    );
  }
  return entry.docTypeNumber;
}