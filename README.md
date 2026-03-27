# 纪念日 Daymark

一个只做一件事的纪念日记录应用。

输入一个名字和日期，页面会告诉你两件事：

- 这个日子已经过去了多少天
- 距离下一次周年纪念还有多久

`Daymark` 的意思是“给日子做一个标记”。首版只解决真实问题，不把它做成日历、社交平台或提醒中心。

## MVP 边界

- 支持新增、编辑、删除纪念日
- 支持多条纪念日本地持久化
- 固定按“距离下一次周年最近”排序
- 支持今天状态、周年倒计时、已过去天数展示

首版明确不做：

- 登录、注册、云同步
- 未来日期
- 备注字段
- 手动排序
- 推送提醒、农历转换、社交分享

## 技术栈

- React
- TypeScript
- Vite
- 原生 CSS
- Vitest + React Testing Library
- Playwright

## 本地运行

```bash
pnpm install
pnpm dev
```

默认开发地址由 Vite 输出。

## 构建与测试

```bash
pnpm build
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
```

## 目录结构

```text
src/
├── app/                    # 页面壳层与全局样式
├── components/             # 表单、卡片、空状态、提示等 UI 组件
├── features/anniversaries/ # 领域类型、状态 Hook、视图派生
├── lib/date/               # 日期纯函数与格式化
├── storage/                # localStorage 适配器
└── tests/                  # 单元与集成测试
tests/e2e/                  # Playwright E2E
```

## 设计判断

这个应用的核心数据结构只有一个：`AnniversaryRecord`。

只持久化原始数据：

- `title`
- `baseDateISO`
- `createdAtISO`
- `updatedAtISO`

不持久化派生值：

- 已过去天数
- 完整周年数
- 距离下一次周年的剩余天数

原因很简单：这些值每天都会变，存下来只会腐烂。
