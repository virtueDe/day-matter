import type { AnniversaryRecord, AnniversarySummaryView, AnniversaryView } from './types';
import { calculateAnniversaryMetrics } from '../../lib/date/anniversary';
import { formatAnniversaryLabel, formatCountdownLabel, formatDisplayDate, formatElapsedLabel } from '../../lib/date/format';

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
    elapsedLabel: formatElapsedLabel(metrics),
    countdownLabel: formatCountdownLabel(metrics),
    anniversaryLabel: formatAnniversaryLabel(metrics),
    highlightLevel: resolveHighlightLevel(metrics.daysUntilNext, metrics.isToday),
  };
}

export function selectAnniversaryViews(records: AnniversaryRecord[], todayISO?: string): AnniversaryView[] {
  return records
    .map((record) => toAnniversaryView(record, todayISO))
    .sort((left, right) => {
      if (left.daysUntilNext !== right.daysUntilNext) {
        return left.daysUntilNext - right.daysUntilNext;
      }

      return left.createdAtISO.localeCompare(right.createdAtISO);
    });
}

export function buildAnniversarySummary(views: AnniversaryView[]): AnniversarySummaryView {
  const upcomingRecord = views[0] ?? null;
  const todayCount = views.filter((view) => view.isToday).length;

  let heroMessage = '把第一个重要日子写下来，时间会替你记住。';

  if (todayCount > 0) {
    heroMessage = `今天有 ${todayCount} 个值得纪念的日子。`;
  } else if (upcomingRecord) {
    heroMessage = `最近的是「${upcomingRecord.title}」，${upcomingRecord.countdownLabel}。`;
  }

  return {
    totalCount: views.length,
    upcomingRecord,
    todayCount,
    heroMessage,
  };
}

