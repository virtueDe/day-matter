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

  it('选择分类后提交成功并显示分类标签', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByLabelText('纪念日名称'), '第一次旅行');
    await user.type(screen.getByLabelText('纪念日期'), '2020-03-27');
    await user.selectOptions(screen.getByLabelText('纪念日分类'), 'relationship');
    await user.click(screen.getByRole('button', { name: '保存纪念日' }));

    expect(screen.getByRole('heading', { level: 3, name: '第一次旅行' })).toBeInTheDocument();
    expect(screen.getAllByText('关系')[0]).toBeInTheDocument();
  });

  it('合法输入时即时预览出现', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByLabelText('纪念日名称'), '领养小猫');
    await user.type(screen.getByLabelText('纪念日期'), '2020-03-27');

    expect(screen.getByText('草稿预览')).toBeInTheDocument();
    expect(screen.getByText('领养小猫')).toBeInTheDocument();
    expect(screen.getByText('就是今天')).toBeInTheDocument();
  });

  it('未来日期时阻止提交并保持非成功态预览', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.type(screen.getByLabelText('纪念日名称'), '未来旅行');
    await user.type(screen.getByLabelText('纪念日期'), '2026-03-28');

    expect(screen.getByText('这个日期现在还不能生成预览')).toBeInTheDocument();
    expect(screen.queryByText('今天是第')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '保存纪念日' }));

    expect(screen.getByText('未来日期暂不在首版支持范围内。')).toBeInTheDocument();
  });

  it('编辑态会回填旧值、预览同步变化并提交更新', async () => {
    const user = userEvent.setup();

    renderApp([createRecord()]);

    await user.click(screen.getByRole('button', { name: '编辑' }));

    const titleInput = screen.getByLabelText('纪念日名称');
    await user.clear(titleInput);
    await user.type(titleInput, '第一次旅行');

    expect(screen.getByText('第一次旅行')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '保存修改' }));

    expect(screen.getByRole('heading', { level: 3, name: '第一次旅行' })).toBeInTheDocument();
    expect(screen.getByText('纪念日已更新。')).toBeInTheDocument();
  });
});
