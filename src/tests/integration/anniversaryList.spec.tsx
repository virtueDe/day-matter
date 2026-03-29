import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createRecord } from '../factories';
import { renderApp } from '../renderApp';

describe('AnniversaryList', () => {
  it('列表为空时展示引导态并可把焦点带到表单', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: '创建第一条纪念日' }));

    expect(screen.getByLabelText('纪念日名称')).toHaveFocus();
  });

  it('卡片正确显示已过去天数、今天状态和分类标签', () => {
    renderApp([
      createRecord({
        title: '今天纪念',
        baseDateISO: '2026-03-27',
        category: 'relationship',
      }),
    ]);

    const card = screen.getByRole('heading', { level: 3, name: '今天纪念' }).closest('article');

    expect(card).not.toBeNull();
    expect(within(card!).getByText('已经过去 0 天')).toBeInTheDocument();
    expect(within(card!).getByText('今天是第 0 个周年纪念日')).toBeInTheDocument();
    expect(within(card!).getByText('关系')).toBeInTheDocument();
  });

  it('点击删除后出现确认框并可删除记录', async () => {
    const user = userEvent.setup();

    renderApp([createRecord()]);

    await user.click(screen.getByRole('button', { name: '删除' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '确认删除' }));

    expect(screen.queryByText('第一次见面')).not.toBeInTheDocument();
    expect(screen.getByText('纪念日已删除。')).toBeInTheDocument();
  });

  it('归档后记录从活跃视图消失并可在归档视图恢复', async () => {
    const user = userEvent.setup();

    renderApp([
      createRecord({
        id: 'first',
        title: '第一次见面',
        category: 'relationship',
      }),
    ]);

    await user.click(screen.getByRole('button', { name: '归档' }));

    expect(screen.queryByRole('heading', { level: 3, name: '第一次见面' })).not.toBeInTheDocument();
    expect(screen.getByText('纪念日已归档。')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '已归档' }));

    expect(screen.getByRole('heading', { level: 3, name: '第一次见面' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '恢复' }));
    await user.click(screen.getByRole('button', { name: '活跃' }));

    expect(screen.getByRole('heading', { level: 3, name: '第一次见面' })).toBeInTheDocument();
  });

  it('筛选无结果时展示专用空态', async () => {
    const user = userEvent.setup();

    renderApp([
      createRecord({
        title: '工作纪念',
        category: 'career',
      }),
    ]);

    await user.click(screen.getByRole('button', { name: '宠物' }));

    expect(screen.getByText('当前筛选没有命中')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '切回全部分类' })).toBeInTheDocument();
  });
});
