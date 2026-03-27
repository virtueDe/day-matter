import type { AnniversaryMetrics } from '../../features/anniversaries/types';
import { createLocalDate } from './normalize';

const DATE_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const CURRENT_DATE_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
});

const CURRENT_TIME_FORMATTER = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const LUNAR_YEAR_FORMATTER = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
  year: 'numeric',
});

const LUNAR_MONTH_DAY_FORMATTER = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
  month: 'long',
  day: 'numeric',
});

const LUNAR_DAY_LABELS = [
  '',
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
];

function formatLunarDay(dayValue: string): string {
  const dayNumber = Number.parseInt(dayValue, 10);

  if (Number.isNaN(dayNumber) || !LUNAR_DAY_LABELS[dayNumber]) {
    return dayValue;
  }

  return LUNAR_DAY_LABELS[dayNumber];
}

export function formatDisplayDate(isoDate: string): string {
  return DATE_FORMATTER.format(createLocalDate(isoDate));
}

export function formatCurrentDate(date: Date): string {
  return CURRENT_DATE_FORMATTER.format(date);
}

export function formatCurrentTime(date: Date): string {
  return CURRENT_TIME_FORMATTER.format(date);
}

export function formatLunarDate(date: Date): string {
  const lunarYear = LUNAR_YEAR_FORMATTER.format(date).replace(/^\d+/, '');
  const lunarParts = LUNAR_MONTH_DAY_FORMATTER.formatToParts(date);
  const lunarMonth = lunarParts.find((part) => part.type === 'month')?.value;
  const lunarDay = lunarParts.find((part) => part.type === 'day')?.value;
  const lunarMonthDay =
    lunarMonth && lunarDay ? `${lunarMonth}${formatLunarDay(lunarDay)}` : LUNAR_MONTH_DAY_FORMATTER.format(date);

  return `${lunarYear} ${lunarMonthDay}`.trim();
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
