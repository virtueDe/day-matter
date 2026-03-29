import type { AnniversaryFilterState, AnniversaryView } from '../../features/anniversaries/types';
import { EmptyState } from '../common/EmptyState';
import { AnniversaryCard } from './AnniversaryCard';
import { AnniversaryFilters } from './AnniversaryFilters';

interface AnniversaryListProps {
  filterState: AnniversaryFilterState;
  hasRecords: boolean;
  onArchive: (recordId: string) => void;
  onArchiveFilterChange: (value: AnniversaryFilterState['archive']) => void;
  onCategoryFilterChange: (value: AnniversaryFilterState['category']) => void;
  onDelete: (recordId: string, trigger: HTMLElement | null) => void;
  onEdit: (recordId: string) => void;
  onEmptyAction: () => void;
  onRestore: (recordId: string) => void;
  views: AnniversaryView[];
}

export function AnniversaryList({
  filterState,
  hasRecords,
  onArchive,
  onArchiveFilterChange,
  onCategoryFilterChange,
  onDelete,
  onEdit,
  onEmptyAction,
  onRestore,
  views,
}: AnniversaryListProps) {
  if (!hasRecords) {
    return <EmptyState onCreateFirst={onEmptyAction} />;
  }

  const hasFilters = filterState.archive !== 'active' || filterState.category !== 'all';

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
      <AnniversaryFilters
        filterState={filterState}
        visibleCount={views.length}
        onArchiveFilterChange={onArchiveFilterChange}
        onCategoryFilterChange={onCategoryFilterChange}
      />
      {views.length === 0 ? (
        <EmptyState
          actionLabel={hasFilters ? '切回全部分类' : '创建第一条纪念日'}
          copy={
            hasFilters
              ? '当前筛选条件下还没有匹配的纪念日。你可以放宽筛选，或者新建一条合适的记录。'
              : '这里还没有可显示的纪念日。'
          }
          eyebrow={hasFilters ? '当前筛选没有命中' : '列表暂时为空'}
          onCreateFirst={() => {
            if (hasFilters) {
              onArchiveFilterChange('active');
              onCategoryFilterChange('all');
              return;
            }

            onEmptyAction();
          }}
          title={hasFilters ? '先把筛选放宽一点，再决定下一步' : '还没有可展示的纪念日'}
        />
      ) : (
      <div className="card-grid">
        {views.map((view) => (
          <AnniversaryCard
            key={view.id}
            view={view}
            onArchive={onArchive}
            onDelete={onDelete}
            onEdit={onEdit}
            onRestore={onRestore}
          />
        ))}
      </div>
      )}
    </section>
  );
}
