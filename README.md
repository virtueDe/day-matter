# Daymark

<p align="center">
  <strong>让重要的日子，被时间温柔记住。</strong>
</p>

<p align="center">
  一个专注记录纪念日的轻量 Web 应用。
  <br />
  不做社交，不做提醒中心，不做臃肿日历，只把“时间过去了多久”和“下一次还要多久”这件事做好。
</p>

<p align="center">
  <a href="https://virtuede.github.io/day-matter/">在线预览</a>
</p>

## 项目简介

`Daymark` 是一个本地优先的纪念日记录应用。

你输入一个名字和日期，它会稳定地回答三件事：

- 这个日子已经过去了多少天
- 今年是不是周年日
- 距离下一次周年还有多久

这个项目的设计原则很直接：

- 先解决真实问题，不堆功能
- 只持久化原始数据，不持久化会自然腐烂的派生值
- 本地优先，打开就能用，不依赖账号系统
- 保持数据兼容，不让旧数据白白失效

## 适合谁

- 想记录恋爱、结婚、入职、毕业、养宠、搬家等重要日子的人
- 想做一个简单但完整的 React + TypeScript 小型产品练手项目的人
- 想看一个“单一领域对象 + 本地持久化 + 纯函数日期计算 + 分层测试”示例的人

## 核心能力

### 记录与管理

- 新增、编辑、删除纪念日
- 支持多条记录的本地持久化
- 支持归档与恢复，避免“只能删除不能收纳”
- 固定按“距离下一次周年最近”排序

### 视图与筛选

- 支持活跃 / 已归档 / 全部 3 种视图
- 支持分类筛选
- 内置分类：关系、家庭、工作、宠物、生活、其他、未分类

### 时间表达

- 展示已过去天数
- 展示完整周年数
- 展示距离下一次周年的剩余天数
- 识别“今天就是纪念日”的特殊状态
- 首页摘要展示当前焦点、近期纪念日和关键统计

### 交互体验

- 表单录入时即时预览
- 删除前二次确认
- 操作完成后即时反馈
- 首页展示当前时间、日期与农历信息

## 当前明确不做

为了保持结构干净，这个项目目前明确不做这些事：

- 登录、注册、云同步
- 未来日期纪念日录入
- 自定义分类体系
- 手动拖拽排序
- 推送提醒
- 农历纪念日换算
- 社交分享

这不是能力问题，是范围控制。小应用一旦开始“什么都想做”，代码很快就会烂掉。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 前端框架 | React 19 |
| 语言 | TypeScript |
| 构建工具 | Vite |
| 样式 | 原生 CSS |
| 单元 / 组件测试 | Vitest + React Testing Library |
| 端到端测试 | Playwright |
| 数据存储 | localStorage |
| 部署 | GitHub Pages + GitHub Actions |

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 9+

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

默认开发地址由 Vite 在终端输出。

### 生产构建

```bash
pnpm build
```

### 本地预览构建结果

```bash
pnpm preview
```

## 测试命令

```bash
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:integration
pnpm test:e2e
```

说明：

- `pnpm test` 会运行 Vitest，并生成 `coverage/` 覆盖率报告
- `pnpm test:integration` 运行集成测试
- `pnpm test:e2e` 会先构建，再执行 Playwright 端到端测试

## 目录结构

```text
.
├── src
│   ├── app                     # 页面壳层与全局样式
│   ├── components              # 领域组件与通用组件
│   ├── features/anniversaries  # 领域类型、状态管理、视图派生
│   ├── lib/date                # 日期计算、规范化、格式化纯函数
│   ├── storage                 # localStorage 读写与迁移
│   └── tests                   # 单元测试与集成测试
├── tests/e2e                   # Playwright 端到端测试
├── scripts                     # 辅助脚本
├── dist                        # 构建产物
└── coverage                    # 测试覆盖率报告
```

## 数据模型

这个项目的核心数据结构只有一个：`AnniversaryRecord`。

```ts
interface AnniversaryRecord {
  id: string;
  title: string;
  baseDateISO: string;
  category: AnniversaryCategory;
  archivedAtISO: string | null;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### 为什么只存原始数据

以下字段不会持久化：

- 已过去天数
- 完整周年数
- 下一次周年日期
- 距离下一次周年还有多少天

原因很简单：这些都是派生值，而且每天都会变化。把它们写进存储，只会制造过期数据、同步问题和更多分支。

## 数据兼容策略

- `localStorage` 继续使用同一个存储 key：`daymark.records.v1`
- 当前存储容器版本为 `version: 2`
- 旧版 `version: 1` 数据会在读取时自动迁移
- 迁移时会补齐：
  - `category = "uncategorized"`
  - `archivedAtISO = null`

这意味着老用户不需要手工清空本地数据。

## 部署说明

项目使用 GitHub Actions 自动构建，并发布到 GitHub Pages。

- 推送到 `master` 会触发 Pages 部署
- 构建产物目录为 `dist/`
- Vite 构建基路径配置为 `/day-matter/`
- Pages 应配置为 `GitHub Actions` 作为发布来源

## 测试覆盖范围

当前测试体系覆盖三个层级：

- 日期计算与格式化等纯函数单元测试
- 表单、列表、筛选、摘要等界面行为集成测试
- 从用户视角验证新增、筛选、归档、恢复等关键 E2E 流程

这套结构的好处是：逻辑错误、组件回归和页面级断裂，分别由不同层次的测试兜住，责任边界比较清楚。

## 设计取舍

这个项目刻意保持“小而完整”，重点在于：

- 用简单数据结构消灭多余分支
- 用派生视图而不是冗余存储表达 UI
- 用本地优先策略换取低复杂度和即时可用
- 用渐进式测试保证改动可回归、可审计

如果你想继续扩展它，建议优先守住这条线：新增功能之前，先问一句“这是不是一个真实问题”。
