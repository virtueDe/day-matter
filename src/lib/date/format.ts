import type { AnniversaryMetrics } from '../../features/anniversaries/types';
import { createLocalDate } from './normalize';

const DATE_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function formatDisplayDate(isoDate: string): string {
  return DATE_FORMATTER.format(createLocalDate(isoDate));
}

export function formatElapsedLabel(metrics: AnniversaryMetrics): string {
  return `已经过去 ${metrics.elapsedDays} 天`;
}

export function formatCountdownLabel(metrics: AnniversaryMetrics): string {
  if (metrics.isToday) {
    return '就是今天';
  }

  return `距离下一次周年还有 ${metrics.daysUntilNext} 天`;
}

export function formatAnniversaryLabel(metrics: AnniversaryMetrics): string {
  if (metrics.isToday) {
    return `今天是第 ${metrics.completedYears} 个周年纪念日`;
  }

  return `已经走过 ${metrics.completedYears} 个完整年头`;
}

