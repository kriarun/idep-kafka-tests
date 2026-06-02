export const DocumentClass = {
  PASSPORT: '1234',
  DRIVING_LICENCE: '5555',
  PAYSLIP: '6789'
} as const;

export type DocumentClassKey = keyof typeof DocumentClass;