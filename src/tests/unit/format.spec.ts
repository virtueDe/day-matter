import { describe, expect, it } from 'vitest';
import { formatCurrentDate, formatCurrentTime, formatLunarDate } from '../../lib/date/format';

describe('date formatters', () => {
  it('格式化首页当前时间、公历日期与农历', () => {
    const currentMoment = new Date(2026, 2, 27, 10, 15, 0);

    expect(formatCurrentTime(currentMoment)).toBe('10:15');
    expect(formatCurrentDate(currentMoment)).toBe('2026年3月27日星期五');
    expect(formatLunarDate(currentMoment)).toBe('丙午年 二月初九');
  });
});
