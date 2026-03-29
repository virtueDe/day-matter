import { describe, expect, it } from 'vitest';
import { createRecord } from '../factories';
import { ANNIVERSARY_STORAGE_KEY, clearRecords, loadRecords, saveRecords } from '../../storage/anniversaryStorage';
import { DEFAULT_ANNIVERSARY_CATEGORY } from '../../features/anniversaries/categories';

describe('anniversaryStorage', () => {
  it('保存后能够正确读回记录列表', () => {
    const record = createRecord();

    saveRecords([record], window.localStorage);

    expect(loadRecords(window.localStorage)).toEqual([record]);
  });

  it('损坏的 JSON 会回退为空数组', () => {
    window.localStorage.setItem(ANNIVERSARY_STORAGE_KEY, '{坏掉了');

    expect(loadRecords(window.localStorage)).toEqual([]);
  });

  it('读取 V1 数据时自动补默认分类和活跃状态', () => {
    window.localStorage.setItem(
      ANNIVERSARY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        records: [
          {
            id: 'legacy-1',
            title: '老数据',
            baseDateISO: '2020-03-27',
            createdAtISO: '2026-03-01T00:00:00.000Z',
            updatedAtISO: '2026-03-01T00:00:00.000Z',
          },
        ],
      }),
    );

    expect(loadRecords(window.localStorage)).toEqual([
      createRecord({
        id: 'legacy-1',
        title: '老数据',
      }),
    ]);
  });

  it('读取结构错误版本时回退为空数组', () => {
    window.localStorage.setItem(
      ANNIVERSARY_STORAGE_KEY,
      JSON.stringify({
        version: 3,
        records: [createRecord()],
      }),
    );

    expect(loadRecords(window.localStorage)).toEqual([]);
  });

  it('保存时统一输出 V2 容器且只写原始字段', () => {
    saveRecords([
      {
        ...createRecord(),
        title: '恋爱纪念日',
      },
    ]);

    const saved = JSON.parse(window.localStorage.getItem(ANNIVERSARY_STORAGE_KEY) ?? '{}') as {
      version: number;
      records: Array<Record<string, unknown>>;
    };

    expect(saved.version).toBe(2);
    expect(saved.records[0].category).toBe(DEFAULT_ANNIVERSARY_CATEGORY);
    expect(saved.records[0].archivedAtISO).toBeNull();
    expect(saved.records[0].elapsedDays).toBeUndefined();
    expect(saved.records[0].daysUntilNext).toBeUndefined();
  });

  it('读取 V2 数据时保留新增字段', () => {
    const record = createRecord({
      id: 'v2-1',
      category: 'pet',
      archivedAtISO: '2026-03-10T00:00:00.000Z',
    });

    window.localStorage.setItem(
      ANNIVERSARY_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        records: [record],
      }),
    );

    expect(loadRecords(window.localStorage)).toEqual([record]);
  });

  it('清空操作会移除存储键', () => {
    saveRecords([createRecord()]);

    clearRecords();

    expect(window.localStorage.getItem(ANNIVERSARY_STORAGE_KEY)).toBeNull();
  });
});
