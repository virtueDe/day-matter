import { DEFAULT_ANNIVERSARY_CATEGORY, getAnniversaryCategoryLabel } from './categories';
import type {
  AnniversaryFilterState,
  AnniversaryFormInput,
  AnniversaryPreviewView,
  AnniversaryRecord,
  AnniversarySummaryView,
  AnniversaryView,
} from './types';
import { calculateAnniversaryMetrics } from '../../lib/date/anniversary';
import { formatAnniversaryLabel, formatCountdownLabel, formatDisplayDate, formatElapsedLabel } from '../../lib/date/format';
import { getTodayISO, isFutureDate } from '../../lib/date/normalize';

const DEFAULT_FILTER_STATE: AnniversaryFilterState = {
  archive: 'active',
  category: 'all',
};

function resolveHighlightLevel(daysUntilNext: number, isToday: boolean): AnniversaryView['highlightLevel'] {
  if (isToday) {
    return 'today';
  }

  if (daysUntilNext <= 30) {
    return 'soon';
  }

  return 'normal';
}

export function toAnniversaryView(record: AnniversaryRecord, todayISO?: string): AnniversaryView {
  const metrics = calculateAnniversaryMetrics(record.baseDateISO, todayISO);

  return {
    ...record,
    ...metrics,
    formattedBaseDate: formatDisplayDate(record.baseDateISO),
    categoryLabel: getAnniversaryCategoryLabel(record.category),
    elapsedLabel: formatElapsedLabel(metrics),
    countdownLabel: formatCountdownLabel(metrics),
    anniversaryLabel: formatAnniversaryLabel(metrics),
    isArchived: record.archivedAtISO !== null,
    highlightLevel: resolveHighlightLevel(metrics.daysUntilNext, metrics.isToday),
  };
}

export function filterAnniversaryViews(
  views: AnniversaryView[],
  filterState: AnniversaryFilterState = DEFAULT_FILTER_STATE,
): AnniversaryView[] {
  return views.filter((view) => {
    if (filterState.archive === 'active' && view.isArchived) {
      return false;
    }

    if (filterState.archive === 'archived' && !view.isArchived) {
      return false;
    }

    if (filterState.category !== 'all' && view.category !== filterState.category) {
      return false;
    }

    return true;
  });
}

export function selectAnniversaryViews(
  records: AnniversaryRecord[],
  todayISO?: string,
  filterState: AnniversaryFilterState = DEFAULT_FILTER_STATE,
): AnniversaryView[] {
  return filterAnniversaryViews(
    records.map((record) => toAnniversaryView(record, todayISO)),
    filterState,
  )
    .sort((left, right) => {
      if (left.daysUntilNext !== right.daysUntilNext) {
        return left.daysUntilNext - right.daysUntilNext;
      }

      return left.createdAtISO.localeCompare(right.createdAtISO);
    });
}

export function buildAnniversaryPreview(
  input: AnniversaryFormInput,
  todayISO: string = getTodayISO(),
): AnniversaryPreviewView | null {
  const normalizedTitle = input.title.trim();

  if (!normalizedTitle || !input.baseDateISO || isFutureDate(input.baseDateISO, todayISO)) {
    return null;
  }

  const previewView = toAnniversaryView(
    {
      id: 'preview',
      title: normalizedTitle,
      baseDateISO: input.baseDateISO,
      category: input.category ?? DEFAULT_ANNIVERSARY_CATEGORY,
      archivedAtISO: null,
      createdAtISO: new Date(0).toISOString(),
      updatedAtISO: new Date(0).toISOString(),
    },
    todayISO,
  );

  return {
    title: previewView.title,
    category: previewView.category,
    categoryLabel: previewView.categoryLabel,
    formattedBaseDate: previewView.formattedBaseDate,
    elapsedLabel: previewView.elapsedLabel,
    countdownLabel: previewView.countdownLabel,
    anniversaryLabel: previewView.anniversaryLabel,
  };
}

function buildScopeLabel(filterState: AnniversaryFilterState): string {
  const scopeParts: string[] = [];

  if (filterState.archive === 'active') {
    scopeParts.push('当前查看活跃纪念日');
  } else if (filterState.archive === 'archived') {
    scopeParts.push('当前查看已归档纪念日');
  } else {
    scopeParts.push('当前查看全部纪念日');
  }

  if (filterState.category !== 'all') {
    scopeParts.push(`分类：${getAnniversaryCategoryLabel(filterState.category)}`);
  }

  return scopeParts.join(' · ');
}

export function buildAnniversarySummary(
  visibleViews: AnniversaryView[],
  allRecords: AnniversaryRecord[] = visibleViews,
  filterState: AnniversaryFilterState = DEFAULT_FILTER_STATE,
): AnniversarySummaryView {
  const allViews = allRecords.map((record) => toAnniversaryView(record));
  const activeViews = allViews.filter((view) => !view.isArchived);
  const spotlightRecord = visibleViews.find((view) => view.isToday) ?? visibleViews[0] ?? null;
  const upcomingCount = activeViews.filter((view) => view.daysUntilNext <= 30).length;
  const categoryBreakdown = visibleViews.reduce<AnniversarySummaryView['categoryBreakdown']>((list, view) => {
    const existing = list.find((item) => item.category === view.category);

    if (existing) {
      existing.count += 1;
      return list;
    }

    list.push({
      category: view.category,
      label: view.categoryLabel,
      count: 1,
    });

    return list;
  }, []);

  categoryBreakdown.sort((left, right) => {
    if (left.count !== right.count) {
      return right.count - left.count;
    }

    return left.label.localeCompare(right.label, 'zh-CN');
  });

  let heroMessage = '把第一个重要日子写下来，时间会替你记住。';

  if (spotlightRecord?.isToday) {
    heroMessage = `今天重点是「${spotlightRecord.title}」，${spotlightRecord.anniversaryLabel}。`;
  } else if (spotlightRecord) {
    heroMessage = `最近值得关注的是「${spotlightRecord.title}」，${spotlightRecord.countdownLabel}。`;
  }

  return {
    spotlightRecord,
    activeCount: activeViews.length,
    archivedCount: allViews.length - activeViews.length,
    visibleCount: visibleViews.length,
    upcomingCount,
    heroMessage,
    scopeLabel: buildScopeLabel(filterState),
    categoryBreakdown,
  };
}
