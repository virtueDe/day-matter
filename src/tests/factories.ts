import type { AnniversaryRecord } from '../features/anniversaries/types';

export function createRecord(overrides: Partial<AnniversaryRecord> = {}): AnniversaryRecord {
  return {
    id: 'record-1',
    title: '第一次见面',
    baseDateISO: '2020-03-27',
    createdAtISO: '2026-03-01T00:00:00.000Z',
    updatedAtISO: '2026-03-01T00:00:00.000Z',
    ...overrides,
  };
}

