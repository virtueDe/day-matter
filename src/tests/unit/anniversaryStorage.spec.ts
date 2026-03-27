import { describe, expect, it } from 'vitest';
import { createRecord } from '../factories';
import { ANNIVERSARY_STORAGE_KEY, clearRecords, loadRecords, saveRecords } from '../../storage/anniversaryStorage';

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

  it('版本结构错误时回退为空数组', () => {
    window.localStorage.setItem(
      ANNIVERSARY_STORAGE_KEY,
      JSON.stringify({
        version: 2,
        records: [createRecord()],
      }),
    );

    expect(loadRecords(window.localStorage)).toEqual([]);
  });

  it('只保存原始字段，不写入派生值', () => {
    saveRecords([
      {
        ...createRecord(),
        title: '恋爱纪念日',
      },
    ]);

    const saved = JSON.parse(window.localStorage.getItem(ANNIVERSARY_STORAGE_KEY) ?? '{}') as {
      records: Array<Record<string, unknown>>;
    };

    expect(saved.records[0].elapsedDays).toBeUndefined();
    expect(saved.records[0].daysUntilNext).toBeUndefined();
  });

  it('清空操作会移除存储键', () => {
    saveRecords([createRecord()]);

    clearRecords();

    expect(window.localStorage.getItem(ANNIVERSARY_STORAGE_KEY)).toBeNull();
  });
});

