# GitHub Pages 自动发布 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前仓库切换为 push 到 `master` 后由 GitHub 官方 Pages 工作流自动构建并发布，不再依赖手工推送 `gh-pages`。

**Architecture:** 在仓库中新增 `.github/workflows/deploy-pages.yml`，使用 GitHub 官方 `configure-pages`、`upload-pages-artifact` 和 `deploy-pages` action。构建阶段沿用现有 `pnpm build` 和 `vite.config.ts` 的 Pages `base` 配置；部署阶段只发布 `dist`，不把构建产物提交回源码分支。

**Tech Stack:** GitHub Actions, GitHub Pages, pnpm, Node.js 20, Vite, TypeScript

---

## 文件结构

- Create: `.github/workflows/deploy-pages.yml`
  - GitHub Pages 官方自动发布工作流，负责安装依赖、构建、上传 artifact、部署。
- Modify: `README.md`
  - 增加部署说明，明确 Pages 由 GitHub Actions 发布，而不是手工推送 `gh-pages`。
- Verify: `vite.config.ts`
  - 保持生产 `base: '/day-matter/'`，不额外改动逻辑，确保仓库页静态资源路径正确。

### Task 1: 新增 GitHub Pages 官方工作流

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Verify: `vite.config.ts`

- [ ] **Step 1: 写一个最小 failing 检查**

先确认仓库里还没有 Pages workflow，避免把现有流程覆盖掉。

Run: `Get-ChildItem .github\\workflows`
Expected: 目录不存在或不存在 `deploy-pages.yml`

- [ ] **Step 2: 写入最小工作流实现**

把下面的工作流内容写入 `.github/workflows/deploy-pages.yml`：

```yaml
name: Deploy Pages

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build site
        run: pnpm build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: 核对 Pages 路径配置不被破坏**

Run: `Get-Content vite.config.ts`
Expected: 仍然包含下面这行，且没有被 workflow 改动：

```ts
base: command === 'build' ? '/day-matter/' : '/',
```

- [ ] **Step 4: 提交工作流文件**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: 增加 GitHub Pages 自动发布工作流"
```

Expected: 生成 1 个只包含 workflow 的提交

### Task 2: 更新仓库文档，消除旧发布方式歧义

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 写 failing 检查，确认 README 还没说明自动发布**

Run: `Select-String -Path README.md -Pattern "GitHub Pages|gh-pages|自动发布"`
Expected: 没有完整说明当前 GitHub Pages 发布方式

- [ ] **Step 2: 在 README 追加部署说明**

在 `README.md` 末尾新增一节，内容如下：

```md
## 部署

项目使用 GitHub Pages 托管静态站点，并由 GitHub Actions 自动发布。

- 推送到 `master` 后，GitHub Actions 会自动执行依赖安装、构建和 Pages 部署
- Pages 发布目标地址：`https://virtuede.github.io/day-matter/`
- 仓库 Pages 来源应设置为 `GitHub Actions`

历史上的 `gh-pages` 分支可保留用于回溯，但不再作为新的正式发布来源。
```

- [ ] **Step 3: 本地校对 README 新增内容**

Run: `Get-Content README.md -TotalCount 220`
Expected: 新增 `## 部署` 小节，措辞与当前实现一致，没有再要求手工推送 `gh-pages`

- [ ] **Step 4: 提交文档说明**

```bash
git add README.md
git commit -m "docs: 补充 GitHub Pages 自动发布说明"
```

Expected: 生成 1 个只包含 README 说明的提交

### Task 3: 验证构建与发布配置，并推送到远端

**Files:**
- Verify: `.github/workflows/deploy-pages.yml`
- Verify: `README.md`
- Verify: `vite.config.ts`

- [ ] **Step 1: 运行本地构建，确认工作流依赖的命令可通过**

Run: `pnpm build`
Expected: PASS，输出包含 `dist/index.html` 和 `dist/assets/...`

- [ ] **Step 2: 检查工作区状态，确认只包含预期文件**

Run: `git status --short`
Expected: 只出现：

```text
M README.md
A .github/workflows/deploy-pages.yml
```

如果还出现别的文件，先确认是否是这次任务引入；不是就不要混入提交。

- [ ] **Step 3: 推送到远端 master**

```bash
git push origin master
```

Expected: 远端出现 workflow 与 README 更新提交

- [ ] **Step 4: 线上验证 Actions 是否触发**

Run:

```bash
git log -1 --oneline
```

Expected: 记下最新提交哈希，然后去 GitHub 仓库的 Actions 页面确认：

- `Deploy Pages` workflow 已被本次 push 触发
- `build` job 成功
- `deploy` job 成功

- [ ] **Step 5: 验证站点可访问**

手动访问：

```text
https://virtuede.github.io/day-matter/
```

Expected:

- 页面能打开
- 静态资源无 404
- 首页能显示“纪念日 Daymark”

- [ ] **Step 6: 如仓库设置未切到 Actions，补充一次人工收口**

如果 workflow 运行了但页面没更新，到 GitHub 仓库设置中确认：

- `Settings`
- `Pages`
- `Build and deployment`
- `Source` 选择 `GitHub Actions`

这一步不是代码修改，但属于上线所需的最后一个配置收口。
