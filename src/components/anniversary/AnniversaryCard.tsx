import type { MouseEvent } from 'react';
import type { AnniversaryView } from '../../features/anniversaries/types';
import { Button } from '../common/Button';

interface AnniversaryCardProps {
  view: AnniversaryView;
  onEdit: (recordId: string) => void;
  onArchive: (recordId: string) => void;
  onDelete: (recordId: string, trigger: HTMLElement | null) => void;
  onRestore: (recordId: string) => void;
}

export function AnniversaryCard({ onArchive, onDelete, onEdit, onRestore, view }: AnniversaryCardProps) {
  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    onDelete(view.id, event.currentTarget);
  }

  return (
    <article className={`anniversary-card anniversary-card--${view.highlightLevel} ${view.isArchived ? 'anniversary-card--archived' : ''}`}>
      <header className="anniversary-card__header">
        <div>
          <p className="anniversary-card__date">{view.formattedBaseDate}</p>
          <h3 className="anniversary-card__title">{view.title}</h3>
          <div className="anniversary-card__tags">
            <span className="badge">{view.categoryLabel}</span>
            {view.isArchived ? <span className="badge badge--archived">已归档</span> : null}
          </div>
        </div>
        {view.highlightLevel === 'today' ? (
          <span className="badge badge--today">就是今天</span>
        ) : view.highlightLevel === 'soon' ? (
          <span className="badge">快到了</span>
        ) : null}
      </header>
      <div className="anniversary-card__metrics">
        <div>
          <p className="anniversary-card__metric-label">已经过去</p>
          <p className="anniversary-card__metric-value">{view.elapsedDays}</p>
          <p className="anniversary-card__metric-copy">{view.elapsedLabel}</p>
        </div>
        <div>
          <p className="anniversary-card__metric-label">下一次周年</p>
          <p className="anniversary-card__metric-value">{view.isToday ? '今天' : view.daysUntilNext}</p>
          <p className="anniversary-card__metric-copy">{view.countdownLabel}</p>
        </div>
      </div>
      <p className="anniversary-card__footer">{view.anniversaryLabel}</p>
      <div className="anniversary-card__actions">
        {view.isArchived ? (
          <Button variant="secondary" onClick={() => onRestore(view.id)}>
            恢复
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => onEdit(view.id)}>
              编辑
            </Button>
            <Button variant="ghost" onClick={() => onArchive(view.id)}>
              归档
            </Button>
          </>
        )}
        <Button variant="danger" onClick={handleDelete}>
          删除
        </Button>
      </div>
    </article>
  );
}
