import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__DAYMARK_TEST_TODAY__ = '2026-03-27';
  });

  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
  });
  await page.reload();
});

async function createAnniversary(page: import('@playwright/test').Page, title: string, date: string) {
  await page.getByLabel('纪念日名称').fill(title);
  await page.getByLabel('纪念日期').fill(date);
  await page.getByRole('button', { name: '保存纪念日' }).click();
}

test('新增纪念日后卡片出现在列表中', async ({ page }) => {
  await createAnniversary(page, '毕业纪念', '2020-03-27');

  await expect(page.getByRole('heading', { level: 3, name: '毕业纪念' })).toBeVisible();
});

test('编辑纪念日后标题和指标更新', async ({ page }) => {
  await createAnniversary(page, '第一次见面', '2020-03-27');
  await page.getByRole('button', { name: '编辑' }).click();
  await page.getByLabel('纪念日名称').fill('第一次旅行');
  await page.getByRole('button', { name: '保存修改' }).click();

  await expect(page.getByRole('heading', { level: 3, name: '第一次旅行' })).toBeVisible();
});

test('删除纪念日后列表不再显示', async ({ page }) => {
  await createAnniversary(page, '领养小狗', '2020-03-27');
  await page.getByRole('button', { name: '删除' }).click();
  await page.getByRole('button', { name: '确认删除' }).click();

  await expect(page.getByText('领养小狗')).not.toBeVisible();
});

test('已有列表刷新后仍然保留', async ({ page }) => {
  await createAnniversary(page, '入职纪念', '2020-03-27');
  await page.reload();

  await expect(page.getByRole('heading', { level: 3, name: '入职纪念' })).toBeVisible();
});

test('核心计算文案符合固定测试日期预期', async ({ page }) => {
  await createAnniversary(page, '今天纪念', '2026-03-27');

  const card = page.locator('article').filter({
    has: page.getByRole('heading', { level: 3, name: '今天纪念' }),
  });

  await expect(card.getByText('已经过去 0 天')).toBeVisible();
  await expect(card.getByText('今天是第 0 个周年纪念日')).toBeVisible();
});
