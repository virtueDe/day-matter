const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

export function isISODate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parts = parseISODateParts(value);
  const candidate = new Date(parts.year, parts.month - 1, parts.day, 12, 0, 0, 0);

  return (
    candidate.getFullYear() === parts.year &&
    candidate.getMonth() === parts.month - 1 &&
    candidate.getDate() === parts.day
  );
}

export function parseISODateParts(value: string): DateParts {
  if (!ISO_DATE_PATTERN.test(value)) {
    throw new Error(`非法日期格式：${value}`);
  }

  const [yearText, monthText, dayText] = value.split('-');

  return {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
  };
}

export function normalizeISODate(value: string): string {
  if (!isISODate(value)) {
    throw new Error(`非法日期内容：${value}`);
  }

  return value;
}

export function createLocalDate(value: string): Date {
  const { year, month, day } = parseISODateParts(normalizeISODate(value));

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function toISODate(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  if (typeof globalThis.__DAYMARK_TEST_TODAY__ === 'string') {
    return normalizeISODate(globalThis.__DAYMARK_TEST_TODAY__);
  }

  return toISODate(new Date());
}

export function diffCalendarDays(laterISO: string, earlierISO: string): number {
  const later = createLocalDate(laterISO);
  const earlier = createLocalDate(earlierISO);

  return Math.round((later.getTime() - earlier.getTime()) / MS_PER_DAY);
}

export function isFutureDate(value: string, todayISO: string = getTodayISO()): boolean {
  return diffCalendarDays(value, todayISO) > 0;
}

