import type { AnniversaryRecord } from '../features/anniversaries/types';
import { DEFAULT_ANNIVERSARY_CATEGORY } from '../features/anniversaries/categories';

export function createRecord(overrides: Partial<AnniversaryRecord> = {}): AnniversaryRecord {
  return {
    id: 'record-1',
    title: '第一次见面',
    baseDateISO: '2020-03-27',
    category: DEFAULT_ANNIVERSARY_CATEGORY,
    archivedAtISO: null,
    createdAtISO: '2026-03-01T00:00:00.000Z',
    updatedAtISO: '2026-03-01T00:00:00.000Z',
    ...overrides,
  };
}
