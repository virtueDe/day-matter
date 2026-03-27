# GitHub Pages 自动发布设计

## 摘要

目标是把当前仓库从“手工构建 + 手工推送 `gh-pages`”切换为“push 到 `master` 后由 GitHub 官方 Pages 工作流自动构建并发布”。这是真问题，因为手工流程容易导致源码版本、线上版本和发布分支状态漂移。最小方案是不再把发布逻辑放在本地命令里，而是把构建和部署收敛到仓库内的 GitHub Actions 工作流。

## 背景与问题

当前仓库已经具备：

- `pnpm build` 作为生产构建入口
- `vite.config.ts` 中面向仓库页的 `base: '/day-matter/'`
- 一个历史遗留的 `gh-pages` 分支

当前问题是：

- 发布流程依赖人工执行，容易漏掉
- `master` 和 `gh-pages` 之间没有稳定的一致性保障
- 本地权限、环境差异会影响发布成功率

## 方案对比

### 方案 A：GitHub 官方 Pages 工作流（推荐）

- 在仓库内新增 GitHub Actions workflow
- `push` 到 `master` 时自动安装依赖、构建、上传 `dist`、发布到 Pages
- Pages 来源改为 `GitHub Actions`

优点：

- GitHub 原生支持，权限模型清晰
- 不再需要手动维护 `gh-pages` 推送逻辑
- 源码分支与发布流程的职责边界清楚

缺点：

- 需要仓库 Pages 设置改为 `GitHub Actions`

### 方案 B：Action 自动推 `gh-pages`

- 工作流构建后把 `dist` 提交并推到 `gh-pages`

优点：

- 兼容现有 `gh-pages` 分支习惯

缺点：

- 继续把构建产物写进 Git 历史，噪音大
- 仍然要维护分支级发布逻辑

### 方案 C：继续手工发布

不值得继续，复杂度没有变少，只是把风险留给人。

## 选定方案

采用方案 A：GitHub 官方 Pages 工作流。

## 设计细节

### 架构

新增一个 workflow 文件，放在 `.github/workflows/deploy-pages.yml`。工作流分成两个 job：

1. `build`
   - checkout
   - 安装 pnpm
   - 安装 Node
   - `pnpm install --frozen-lockfile`
   - `pnpm build`
   - 上传 `dist` 为 Pages artifact

2. `deploy`
   - 依赖 `build`
   - 使用 GitHub 官方 Pages deploy action 发布

### 触发条件

- `push` 到 `master`
- `workflow_dispatch`

### 权限

workflow 需要最小必要权限：

- `contents: read`
- `pages: write`
- `id-token: write`

并发策略要限制为同一分支只保留最新部署，避免过时任务覆盖新版本。

### 构建约束

- 保留当前 `vite.config.ts` 的生产 `base: '/day-matter/'`
- 不引入额外部署依赖
- 不再要求本地手工推 `gh-pages`

### 兼容性与回滚

- 不修改业务代码和数据结构
- 旧 `gh-pages` 分支先保留，不作为新的正式来源
- 如果 Actions 方案出问题，回滚方式就是回退 workflow 文件，并恢复手工发布

## 测试与验证

本地验证范围：

- workflow YAML 结构正确
- `pnpm build` 可通过

线上验证范围：

- push 到 `master` 后 GitHub Actions 自动执行
- Pages 部署成功
- 站点地址 `https://virtuede.github.io/day-matter/` 正常打开且静态资源无 404

## 风险

- 如果仓库 Pages 设置仍指向旧的分支来源，workflow 虽然会跑，但页面不会按预期切换到 Actions 发布
- 如果后续修改仓库名，`vite.config.ts` 的 `base` 也必须同步修改

## 实施边界

本次只做：

- 新增 GitHub Actions Pages 发布 workflow
- 保持现有构建入口和 Pages base 配置

本次不做：

- 删除旧 `gh-pages` 分支
- 引入额外 CI 任务，例如测试矩阵或预览环境
