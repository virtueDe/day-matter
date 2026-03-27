import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createRecord } from '../factories';
import { renderApp } from '../renderApp';

describe('App', () => {
  it('首页加载后展示主结构', () => {
    renderApp();

    expect(screen.getByRole('heading', { level: 1, name: '让重要的日子，不只被记住一次。' })).toBeInTheDocument();
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
});
