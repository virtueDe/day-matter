import type { MouseEvent } from 'react';
import type { AnniversaryView } from '../../features/anniversaries/types';
import { Button } from '../common/Button';

interface AnniversaryCardProps {
  view: AnniversaryView;
  onEdit: (recordId: string) => void;
  onDelete: (recordId: string, trigger: HTMLElement | null) => void;
}

export function AnniversaryCard({ onDelete, onEdit, view }: AnniversaryCardProps) {
  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    onDelete(view.id, event.currentTarget);
  }

  return (
    <article className={`anniversary-card anniversary-card--${view.highlightLevel}`}>
      <header className="anniversary-card__header">
        <div>
          <p className="anniversary-card__date">{view.formattedBaseDate}</p>
          <h3 className="anniversary-card__title">{view.title}</h3>
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
        <Button variant="secondary" onClick={() => onEdit(view.id)}>
          编辑
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          删除
        </Button>
      </div>
    </article>
  );
}

