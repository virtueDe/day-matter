import type { AnniversaryMetrics } from '../../features/anniversaries/types';
import { createLocalDate, diffCalendarDays, getTodayISO, normalizeISODate, parseISODateParts, toISODate } from './normalize';

function buildAnniversaryDate(year: number, baseDateISO: string): string {
  const { month, day } = parseISODateParts(baseDateISO);
  const candidate = new Date(year, month - 1, day, 12, 0, 0, 0);

  if (candidate.getMonth() !== month - 1 || candidate.getDate() !== day) {
    if (month === 2 && day === 29) {
      return toISODate(new Date(year, 1, 28, 12, 0, 0, 0));
    }

    throw new Error(`无法生成周年日期：${baseDateISO}`);
  }

  return toISODate(candidate);
}

export function calculateAnniversaryMetrics(
  baseDateISO: string,
  todayISO: string = getTodayISO(),
): AnniversaryMetrics {
  const normalizedBaseDate = normalizeISODate(baseDateISO);
  const normalizedToday = normalizeISODate(todayISO);

  if (diffCalendarDays(normalizedToday, normalizedBaseDate) < 0) {
    throw new Error('未来日期不属于当前 MVP 范围');
  }

  const today = createLocalDate(normalizedToday);
  const baseDate = createLocalDate(normalizedBaseDate);
  const candidateThisYear = buildAnniversaryDate(today.getFullYear(), normalizedBaseDate);

  const nextAnniversaryISO =
    diffCalendarDays(candidateThisYear, normalizedToday) >= 0
      ? candidateThisYear
      : buildAnniversaryDate(today.getFullYear() + 1, normalizedBaseDate);

  const daysUntilNext = diffCalendarDays(nextAnniversaryISO, normalizedToday);
  const isToday = daysUntilNext === 0;
  const completedYears = isToday
    ? today.getFullYear() - baseDate.getFullYear()
    : createLocalDate(nextAnniversaryISO).getFullYear() - baseDate.getFullYear() - 1;

  return {
    elapsedDays: diffCalendarDays(normalizedToday, normalizedBaseDate),
    completedYears,
    nextAnniversaryISO,
    daysUntilNext,
    isToday,
  };
}

