import { describe, expect, it } from 'vitest';
import { ANNIVERSARY_CATEGORY_OPTIONS } from '../../features/anniversaries/categories';
import {
  buildAnniversaryPreview,
  buildAnniversarySummary,
  filterAnniversaryViews,
  selectAnniversaryViews,
} from '../../features/anniversaries/selectors';
import { createRecord } from '../factories';

describe('selectors', () => {
  it('分类常量输出顺序和文案稳定', () => {
    expect(ANNIVERSARY_CATEGORY_OPTIONS.map((option) => option.label)).toEqual([
      '关系',
      '家庭',
      '工作',
      '宠物',
      '生活',
      '其他',
      '未分类',
    ]);
  });

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

  it('筛选后仍保持默认排序', () => {
    const allViews = selectAnniversaryViews(
      [
        createRecord({
          id: 'archived',
          title: '已归档纪念',
          baseDateISO: '2020-03-28',
          archivedAtISO: '2026-03-01T00:00:00.000Z',
          category: 'pet',
        }),
        createRecord({
          id: 'relationship',
          title: '关系纪念',
          baseDateISO: '2020-03-29',
          category: 'relationship',
        }),
        createRecord({
          id: 'family',
          title: '家庭纪念',
          baseDateISO: '2020-04-10',
          category: 'family',
        }),
      ],
      '2026-03-27',
      { archive: 'all', category: 'all' },
    );

    const filtered = filterAnniversaryViews(allViews, {
      archive: 'active',
      category: 'relationship',
    });

    expect(filtered.map((view) => view.id)).toEqual(['relationship']);
  });

  it('合法输入能生成即时预览视图', () => {
    const preview = buildAnniversaryPreview(
      {
        title: '第一次旅行',
        baseDateISO: '2020-03-27',
        category: 'relationship',
      },
      '2026-03-27',
    );

    expect(preview).not.toBeNull();
    expect(preview?.title).toBe('第一次旅行');
    expect(preview?.categoryLabel).toBe('关系');
    expect(preview?.countdownLabel).toBe('就是今天');
  });

  it('未来日期不会生成成功态预览', () => {
    expect(
      buildAnniversaryPreview(
        {
          title: '未来旅行',
          baseDateISO: '2026-03-28',
          category: 'life',
        },
        '2026-03-27',
      ),
    ).toBeNull();
  });

  it('摘要会优先聚焦今天或近期条目', () => {
    const records = [
      createRecord({
        title: '四月纪念',
        baseDateISO: '2020-04-10',
        category: 'life',
      }),
      createRecord({
        id: 'today',
        title: '今天纪念',
        baseDateISO: '2020-03-27',
        category: 'relationship',
      }),
      createRecord({
        id: 'archived',
        title: '旧日子',
        baseDateISO: '2020-03-30',
        category: 'family',
        archivedAtISO: '2026-03-01T00:00:00.000Z',
      }),
    ];
    const visibleViews = selectAnniversaryViews(records, '2026-03-27', {
      archive: 'active',
      category: 'all',
    });
    const summary = buildAnniversarySummary(visibleViews, records, {
      archive: 'active',
      category: 'all',
    });

    expect(summary.spotlightRecord?.title).toBe('今天纪念');
    expect(summary.activeCount).toBe(2);
    expect(summary.archivedCount).toBe(1);
    expect(summary.upcomingCount).toBe(2);
    expect(summary.heroMessage).toContain('今天纪念');
  });
});
