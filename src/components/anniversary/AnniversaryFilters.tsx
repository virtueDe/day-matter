import { ANNIVERSARY_CATEGORY_OPTIONS } from '../../features/anniversaries/categories';
import type { AnniversaryArchiveFilter, AnniversaryFilterState } from '../../features/anniversaries/types';

interface AnniversaryFiltersProps {
  filterState: AnniversaryFilterState;
  visibleCount: number;
  onArchiveFilterChange: (value: AnniversaryArchiveFilter) => void;
  onCategoryFilterChange: (value: AnniversaryFilterState['category']) => void;
}

const ARCHIVE_FILTER_OPTIONS: Array<{ value: AnniversaryArchiveFilter; label: string }> = [
  { value: 'active', label: '活跃' },
  { value: 'archived', label: '已归档' },
  { value: 'all', label: '全部' },
];

export function AnniversaryFilters({
  filterState,
  visibleCount,
  onArchiveFilterChange,
  onCategoryFilterChange,
}: AnniversaryFiltersProps) {
  return (
    <section className="filters" aria-label="纪念日筛选">
      <div className="filters__row">
        <div className="filters__segment" role="group" aria-label="归档范围">
          {ARCHIVE_FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              aria-pressed={filterState.archive === option.value}
              className={`filters__chip ${filterState.archive === option.value ? 'filters__chip--active' : ''}`}
              type="button"
              onClick={() => onArchiveFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="filters__count">当前可见 {visibleCount} 条</p>
      </div>
      <div className="filters__row filters__row--wrap">
        <button
          aria-pressed={filterState.category === 'all'}
          className={`filters__chip ${filterState.category === 'all' ? 'filters__chip--active' : ''}`}
          type="button"
          onClick={() => onCategoryFilterChange('all')}
        >
          全部分类
        </button>
        {ANNIVERSARY_CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            aria-pressed={filterState.category === option.value}
            className={`filters__chip ${filterState.category === option.value ? 'filters__chip--active' : ''}`}
            type="button"
            onClick={() => onCategoryFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
