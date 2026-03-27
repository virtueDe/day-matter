import type { AnniversaryRecord, AnniversaryStoreV1 } from '../features/anniversaries/types';

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
    typeof record.createdAtISO === 'string' &&
    typeof record.updatedAtISO === 'string'
  );
}

function isAnniversaryStoreV1(value: unknown): value is AnniversaryStoreV1 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const store = value as Record<string, unknown>;

  return store.version === 1 && Array.isArray(store.records) && store.records.every(isAnniversaryRecord);
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

    return isAnniversaryStoreV1(parsed) ? parsed.records : [];
  } catch {
    return [];
  }
}

export function saveRecords(records: AnniversaryRecord[], storage?: Storage): void {
  const target = resolveStorage(storage);

  if (!target) {
    return;
  }

  const store: AnniversaryStoreV1 = {
    version: 1,
    records: records.map((record) => ({
      id: record.id,
      title: record.title,
      baseDateISO: record.baseDateISO,
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

