import { describe, expect, it } from 'vitest';
import { buildAnniversarySummary, selectAnniversaryViews } from '../../features/anniversaries/selectors';
import { createRecord } from '../factories';

describe('selectors', () => {
  it('按距离下一次周年最近排序', () => {
    const views = selectAnniversaryViews(
      [
        createRecord({
          id: 'c',
          title: '五月纪念',
          baseDateISO: '2020-05-10',
          createdAtISO: '2026-03-03T00:00:00.000Z',
        }),
        createRecord({
          id: 'a',
          title: '今天纪念',
          baseDateISO: '2020-03-27',
          createdAtISO: '2026-03-01T00:00:00.000Z',
        }),
        createRecord({
          id: 'b',
          title: '四月纪念',
          baseDateISO: '2020-04-10',
          createdAtISO: '2026-03-02T00:00:00.000Z',
        }),
      ],
      '2026-03-27',
    );

    expect(views.map((view) => view.title)).toEqual(['今天纪念', '四月纪念', '五月纪念']);
  });

  it('倒计时相同时按创建时间稳定排序', () => {
    const views = selectAnniversaryViews(
      [
        createRecord({
          id: 'later',
          title: '第二条',
          baseDateISO: '2020-04-10',
          createdAtISO: '2026-03-03T00:00:00.000Z',
        }),
        createRecord({
          id: 'earlier',
          title: '第一条',
          baseDateISO: '2022-04-10',
          createdAtISO: '2026-03-01T00:00:00.000Z',
        }),
      ],
      '2026-03-27',
    );

    expect(views.map((view) => view.id)).toEqual(['earlier', 'later']);
  });

  it('摘要会优先展示最近的纪念日', () => {
    const summary = buildAnniversarySummary(
      selectAnniversaryViews(
        [
          createRecord({
            title: '四月纪念',
            baseDateISO: '2020-04-10',
          }),
        ],
        '2026-03-27',
      ),
    );

    expect(summary.totalCount).toBe(1);
    expect(summary.upcomingRecord?.title).toBe('四月纪念');
    expect(summary.heroMessage).toContain('四月纪念');
  });
});

