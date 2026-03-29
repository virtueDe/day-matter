import { DEFAULT_ANNIVERSARY_CATEGORY } from '../features/anniversaries/categories';
import type {
  AnniversaryRecord,
  AnniversaryRecordV1,
  AnniversaryStoreV1,
  AnniversaryStoreV2,
} from '../features/anniversaries/types';

export const ANNIVERSARY_STORAGE_KEY = 'daymark.records.v1';

function isAnniversaryRecord(value: unknown): value is AnniversaryRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.baseDateISO === 'string' &&
    typeof record.category === 'string' &&
    (record.archivedAtISO === null || typeof record.archivedAtISO === 'string') &&
    typeof record.createdAtISO === 'string' &&
    typeof record.updatedAtISO === 'string'
  );
}

function isAnniversaryRecordV1(value: unknown): value is AnniversaryRecordV1 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.baseDateISO === 'string' &&
    typeof record.createdAtISO === 'string' &&
    typeof record.updatedAtISO === 'string'
  );
}

function isAnniversaryStoreV1(value: unknown): value is AnniversaryStoreV1 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const store = value as Record<string, unknown>;

  return store.version === 1 && Array.isArray(store.records) && store.records.every(isAnniversaryRecordV1);
}

function isAnniversaryStoreV2(value: unknown): value is AnniversaryStoreV2 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const store = value as Record<string, unknown>;

  return store.version === 2 && Array.isArray(store.records) && store.records.every(isAnniversaryRecord);
}

function migrateRecord(record: AnniversaryRecordV1): AnniversaryRecord {
  return {
    id: record.id,
    title: record.title,
    baseDateISO: record.baseDateISO,
    category: DEFAULT_ANNIVERSARY_CATEGORY,
    archivedAtISO: null,
    createdAtISO: record.createdAtISO,
    updatedAtISO: record.updatedAtISO,
  };
}

function resolveStorage(storage?: Storage): Storage | null {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function loadRecords(storage?: Storage): AnniversaryRecord[] {
  const target = resolveStorage(storage);

  if (!target) {
    return [];
  }

  const rawValue = target.getItem(ANNIVERSARY_STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (isAnniversaryStoreV2(parsed)) {
      return parsed.records;
    }

    if (isAnniversaryStoreV1(parsed)) {
      return parsed.records.map(migrateRecord);
    }

    return [];
  } catch {
    return [];
  }
}

export function saveRecords(records: AnniversaryRecord[], storage?: Storage): void {
  const target = resolveStorage(storage);

  if (!target) {
    return;
  }

  const store: AnniversaryStoreV2 = {
    version: 2,
    records: records.map((record) => ({
      id: record.id,
      title: record.title,
      baseDateISO: record.baseDateISO,
      category: record.category,
      archivedAtISO: record.archivedAtISO,
      createdAtISO: record.createdAtISO,
      updatedAtISO: record.updatedAtISO,
    })),
  };

  target.setItem(ANNIVERSARY_STORAGE_KEY, JSON.stringify(store));
}

export function clearRecords(storage?: Storage): void {
  const target = resolveStorage(storage);

  if (!target) {
    return;
  }

  target.removeItem(ANNIVERSARY_STORAGE_KEY);
}
