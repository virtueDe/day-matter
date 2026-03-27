import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createRecord } from '../factories';
import { renderApp } from '../renderApp';

describe('AnniversaryForm', () => {
  it('名称为空时阻止提交并显示错误', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(screen.getByRole('button', { name: '保存纪念日' }));

    expect(screen.getByText('请先写下这个日子的名字。')).toBeInTheDocument();
  });

  it('日期为空时阻止提交并显示错误', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByLabelText('纪念日名称'), '领养小猫');
    await user.click(screen.getByRole('button', { name: '保存纪念日' }));

    expect(screen.getByText('请选择一个日期。')).toBeInTheDocument();
  });

  it('未来日期时阻止提交并显示错误', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByLabelText('纪念日名称'), '未来旅行');
    await user.type(screen.getByLabelText('纪念日期'), '2026-03-28');
    await user.click(screen.getByRole('button', { name: '保存纪念日' }));

    expect(screen.getByText('未来日期暂不在首版支持范围内。')).toBeInTheDocument();
  });

  it('编辑态会回填旧值并提交更新', async () => {
    const user = userEvent.setup();

    renderApp([createRecord()]);

    await user.click(screen.getByRole('button', { name: '编辑' }));

    const titleInput = screen.getByLabelText('纪念日名称');
    await user.clear(titleInput);
    await user.type(titleInput, '第一次旅行');
    await user.click(screen.getByRole('button', { name: '保存修改' }));

    expect(screen.getByRole('heading', { level: 3, name: '第一次旅行' })).toBeInTheDocument();
    expect(screen.getByText('纪念日已更新。')).toBeInTheDocument();
  });
});
