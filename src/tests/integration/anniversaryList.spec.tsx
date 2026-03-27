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

  it('卡片正确显示已过去天数和今天状态', () => {
    renderApp([
      createRecord({
        title: '今天纪念',
        baseDateISO: '2026-03-27',
      }),
    ]);

    const card = screen.getByRole('heading', { level: 3, name: '今天纪念' }).closest('article');

    expect(card).not.toBeNull();
    expect(within(card!).getByText('已经过去 0 天')).toBeInTheDocument();
    expect(within(card!).getByText('今天是第 0 个周年纪念日')).toBeInTheDocument();
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
});
