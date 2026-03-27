import { describe, expect, it } from 'vitest';
import { calculateAnniversaryMetrics } from '../../lib/date/anniversary';
import { formatCountdownLabel } from '../../lib/date/format';

describe('calculateAnniversaryMetrics', () => {
  it('同一天返回 0 天且标记为今天', () => {
    const metrics = calculateAnniversaryMetrics('2026-03-27', '2026-03-27');

    expect(metrics.elapsedDays).toBe(0);
    expect(metrics.daysUntilNext).toBe(0);
    expect(metrics.isToday).toBe(true);
    expect(metrics.completedYears).toBe(0);
  });

  it('当本年周年还没到时，返回当年的周年日期', () => {
    const metrics = calculateAnniversaryMetrics('2020-04-10', '2026-03-27');

    expect(metrics.nextAnniversaryISO).toBe('2026-04-10');
    expect(metrics.daysUntilNext).toBe(14);
    expect(metrics.completedYears).toBe(5);
  });

  it('当本年周年已过时，切换到下一年周年', () => {
    const metrics = calculateAnniversaryMetrics('2020-02-10', '2026-03-27');

    expect(metrics.nextAnniversaryISO).toBe('2027-02-10');
    expect(metrics.completedYears).toBe(6);
  });

  it('闰年 2 月 29 日在平年按 2 月 28 日计算周年', () => {
    const metrics = calculateAnniversaryMetrics('2020-02-29', '2026-02-28');

    expect(metrics.isToday).toBe(true);
    expect(metrics.nextAnniversaryISO).toBe('2026-02-28');
    expect(metrics.completedYears).toBe(6);
  });

  it('今天状态输出就是今天', () => {
    const metrics = calculateAnniversaryMetrics('2026-03-27', '2026-03-27');

    expect(formatCountdownLabel(metrics)).toBe('就是今天');
  });

  it('未来日期会被拒绝', () => {
    expect(() => calculateAnniversaryMetrics('2026-03-28', '2026-03-27')).toThrow('未来日期');
  });
});

