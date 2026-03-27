import type { AnniversaryView } from '../../features/anniversaries/types';
import { EmptyState } from '../common/EmptyState';
import { AnniversaryCard } from './AnniversaryCard';

interface AnniversaryListProps {
  onDelete: (recordId: string, trigger: HTMLElement | null) => void;
  onEdit: (recordId: string) => void;
  onEmptyAction: () => void;
  views: AnniversaryView[];
}

export function AnniversaryList({ onDelete, onEdit, onEmptyAction, views }: AnniversaryListProps) {
  if (views.length === 0) {
    return <EmptyState onCreateFirst={onEmptyAction} />;
  }

  return (
    <section aria-labelledby="list-title" className="list-panel">
      <div className="list-panel__heading">
        <div>
          <p className="list-panel__eyebrow">时间册</p>
          <h2 className="list-panel__title" id="list-title">
            默认按最近周年排序
          </h2>
        </div>
        <p className="list-panel__copy">越快到来的纪念日，越应该待在更上面。</p>
      </div>
      <div className="card-grid">
        {views.map((view) => (
          <AnniversaryCard key={view.id} view={view} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </section>
  );
}

