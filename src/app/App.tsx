import { useRef } from 'react';
import { AnniversaryForm } from '../components/anniversary/AnniversaryForm';
import { AnniversaryList } from '../components/anniversary/AnniversaryList';
import { AnniversarySummary } from '../components/anniversary/AnniversarySummary';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';
import { useAnniversaries } from '../features/anniversaries/useAnniversaries';

export function App() {
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const {
    confirmDelete,
    closeDeleteDialog,
    editingRecord,
    hasRecords,
    pendingDeleteRecord,
    requestDelete,
    startEdit,
    submitRecord,
    summary,
    toast,
    views,
    cancelEdit,
  } = useAnniversaries();

  function focusCreateForm() {
    titleInputRef.current?.focus();
  }

  return (
    <div className="page-shell">
      <main className="page" data-has-records={hasRecords}>
        <AnniversarySummary summary={summary} />
        <section className="workspace" aria-label="纪念日工作区">
          <aside className="workspace__aside">
            <AnniversaryForm
              editingRecord={editingRecord}
              titleInputRef={titleInputRef}
              onCancelEdit={cancelEdit}
              onSubmit={submitRecord}
            />
          </aside>
          <section className="workspace__main">
            <AnniversaryList
              views={views}
              onDelete={requestDelete}
              onEdit={startEdit}
              onEmptyAction={focusCreateForm}
            />
          </section>
        </section>
      </main>
      <ConfirmDialog
        open={Boolean(pendingDeleteRecord)}
        title={pendingDeleteRecord?.title}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
      {toast ? <Toast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}

