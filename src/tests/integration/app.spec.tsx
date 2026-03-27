import { act, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRecord } from '../factories';
import { renderApp } from '../renderApp';

describe('App', () => {
  it('首页加载后展示主结构', () => {
    renderApp();

    expect(screen.getByRole('heading', { level: 1, name: '让重要的日子，被时间温柔记住。' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /名称和日期就够了/ })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('有数据时摘要区会更新最近纪念日', () => {
    renderApp([
      createRecord({
        title: '四月纪念',
        baseDateISO: '2020-04-10',
      }),
    ]);

    expect(screen.getByText(/最近的是「四月纪念」/)).toBeInTheDocument();
  });

  it('工作区使用语义容器包裹表单与列表', () => {
    renderApp([createRecord()]);

    expect(screen.getByLabelText('纪念日工作区')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '默认按最近周年排序' })).toBeInTheDocument();
  });

  it('首页展示当前时间、日期和农历，并会按分钟刷新', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 27, 10, 15, 0));

    try {
      renderApp();

      expect(screen.getByRole('group', { name: '当前时间信息' })).toBeInTheDocument();
      expect(screen.getByText('10:15')).toBeInTheDocument();
      expect(screen.getByText('2026年3月27日星期五')).toBeInTheDocument();
      expect(screen.getByText('丙午年 二月初九')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(60_000);
      });

      expect(screen.getByText('10:16')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
