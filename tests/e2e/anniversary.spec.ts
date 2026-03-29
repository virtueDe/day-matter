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

function anniversaryCard(page: import('@playwright/test').Page, title: string) {
  return page.locator('article.anniversary-card').filter({
    has: page.getByRole('heading', { level: 3, name: title }),
  });
}

async function createAnniversary(
  page: import('@playwright/test').Page,
  title: string,
  date: string,
  category: string = 'uncategorized',
) {
  await page.getByLabel('纪念日名称').fill(title);
  await page.getByLabel('纪念日期').fill(date);
  await page.getByLabel('纪念日分类').selectOption(category);
  await page.getByRole('button', { name: '保存纪念日' }).click();
}

test('新建带分类的记录后可被对应筛选命中', async ({ page }) => {
  await createAnniversary(page, '毕业纪念', '2020-03-27', 'career');

  await expect(page.getByRole('heading', { level: 3, name: '毕业纪念' })).toBeVisible();
  await expect(page.getByText('工作').first()).toBeVisible();

  await page.getByRole('button', { name: '工作' }).click();

  await expect(page.getByRole('heading', { level: 3, name: '毕业纪念' })).toBeVisible();
});

test('归档后记录移出活跃并可在归档视图恢复', async ({ page }) => {
  await createAnniversary(page, '领养小狗', '2020-03-27', 'pet');
  await anniversaryCard(page, '领养小狗').getByRole('button', { name: '归档', exact: true }).click();

  await expect(anniversaryCard(page, '领养小狗')).toHaveCount(0);

  await page.getByRole('button', { name: '已归档', exact: true }).click();
  await expect(anniversaryCard(page, '领养小狗')).toBeVisible();

  await anniversaryCard(page, '领养小狗').getByRole('button', { name: '恢复', exact: true }).click();
  await page.getByRole('button', { name: '活跃', exact: true }).click();

  await expect(anniversaryCard(page, '领养小狗')).toBeVisible();
});

test('录入时即时预览可见且随输入变化', async ({ page }) => {
  await page.getByLabel('纪念日名称').fill('今天纪念');
  await page.getByLabel('纪念日期').fill('2026-03-27');

  await expect(page.getByText('草稿预览')).toBeVisible();
  await expect(page.getByText('就是今天')).toBeVisible();
});

test('首页摘要展示近期重点和关键指标', async ({ page }) => {
  await createAnniversary(page, '入职纪念', '2020-04-10', 'career');
  const summaryRegion = page.getByRole('region', { name: '让重要的日子，被时间温柔记住。' });

  await expect(summaryRegion.getByText('当前焦点', { exact: true })).toBeVisible();
  await expect(summaryRegion.getByText('入职纪念', { exact: true })).toBeVisible();
  await expect(summaryRegion.getByText('当前可见', { exact: true })).toBeVisible();
  await expect(summaryRegion.getByText('30 天内将到来', { exact: true })).toBeVisible();
});
