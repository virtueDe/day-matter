import { useEffect, useMemo, useRef, useState } from 'react';
import { getTodayISO, isFutureDate } from '../../lib/date/normalize';
import { clearRecords, loadRecords, saveRecords } from '../../storage/anniversaryStorage';
import { buildAnniversarySummary, selectAnniversaryViews } from './selectors';
import type { AnniversaryFormErrors, AnniversaryFormInput, AnniversaryRecord } from './types';

interface ToastState {
  id: number;
  message: string;
  tone: 'success' | 'error';
}

function createRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `record-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function validateAnniversaryFormInput(
  input: AnniversaryFormInput,
  todayISO: string = getTodayISO(),
): AnniversaryFormErrors {
  const errors: AnniversaryFormErrors = {};
  const normalizedTitle = input.title.trim();

  if (!normalizedTitle) {
    errors.title = '请先写下这个日子的名字。';
  } else if (normalizedTitle.length > 40) {
    errors.title = '名字保持在 40 个字符以内即可。';
  }

  if (!input.baseDateISO) {
    errors.baseDateISO = '请选择一个日期。';
  } else if (isFutureDate(input.baseDateISO, todayISO)) {
    errors.baseDateISO = '未来日期暂不在首版支持范围内。';
  }

  return errors;
}

export function useAnniversaries() {
  const [records, setRecords] = useState<AnniversaryRecord[]>(() => loadRecords());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const deleteTriggerRef = useRef<HTMLElement | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const views = useMemo(() => selectAnniversaryViews(records), [records]);
  const summary = useMemo(() => buildAnniversarySummary(views), [views]);
  const editingRecord = useMemo(
    () => records.find((record) => record.id === editingId) ?? null,
    [editingId, records],
  );
  const pendingDeleteRecord = useMemo(
    () => records.find((record) => record.id === pendingDeleteId) ?? null,
    [pendingDeleteId, records],
  );

  function queueToast(message: string, tone: ToastState['tone']) {
    setToast({
      id: Date.now(),
      message,
      tone,
    });
  }

  function submitRecord(input: AnniversaryFormInput) {
    const nowISO = new Date().toISOString();
    const normalizedTitle = input.title.trim();

    setRecords((currentRecords) => {
      if (editingId) {
        return currentRecords.map((record) =>
          record.id === editingId
            ? {
                ...record,
                title: normalizedTitle,
                baseDateISO: input.baseDateISO,
                updatedAtISO: nowISO,
              }
            : record,
        );
      }

      return [
        ...currentRecords,
        {
          id: createRecordId(),
          title: normalizedTitle,
          baseDateISO: input.baseDateISO,
          createdAtISO: nowISO,
          updatedAtISO: nowISO,
        },
      ];
    });

    if (editingId) {
      setEditingId(null);
      queueToast('纪念日已更新。', 'success');
      return;
    }

    queueToast('纪念日已写入时间册。', 'success');
  }

  function startEdit(recordId: string) {
    setEditingId(recordId);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function requestDelete(recordId: string, trigger?: HTMLElement | null) {
    deleteTriggerRef.current = trigger ?? null;
    setPendingDeleteId(recordId);
  }

  function closeDeleteDialog() {
    setPendingDeleteId(null);
    deleteTriggerRef.current?.focus();
  }

  function confirmDelete() {
    if (!pendingDeleteId) {
      return;
    }

    const deletingEditingRecord = editingId === pendingDeleteId;

    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== pendingDeleteId));
    setPendingDeleteId(null);

    if (deletingEditingRecord) {
      setEditingId(null);
    }

    deleteTriggerRef.current?.focus();
    queueToast('纪念日已删除。', 'success');
  }

  function resetAll() {
    clearRecords();
    setRecords([]);
    setEditingId(null);
    setPendingDeleteId(null);
  }

  return {
    records,
    views,
    summary,
    editingRecord,
    pendingDeleteRecord,
    toast,
    hasRecords: views.length > 0,
    submitRecord,
    startEdit,
    cancelEdit,
    requestDelete,
    closeDeleteDialog,
    confirmDelete,
    resetAll,
  };
}

