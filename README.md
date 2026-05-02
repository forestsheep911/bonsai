# 盆景 Bonsai

一个个人开发者的项目盆景园。

Bonsai 用来持续、轻量、有状态地展示正在做、正在跑、暂停或归档的项目。它不是代码托管、协作工具或一次性发布页，而是一个可以对外分享的项目全景与培育日志。

## 当前目标

- 公开项目列表页
- 项目详情页
- 项目状态、标签、链接、指标、里程碑与 Markdown 故事
- 单人后台编辑体验
- Azure Static Web Apps + Azure Functions + Cosmos DB 部署路径

## 技术栈

- Vite + React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- Zod 领域模型校验
- Azure Functions API
- Azure Static Web Apps Auth

## 本地开发

```bash
pnpm install
pnpm dev
```

## 验证

```bash
pnpm check
pnpm typecheck
pnpm build
```

## 设计资产

想象中的网站截图和可调提示词放在 `design/` 下：

- `design/image-prompts/screen-prompts.config.json`
- `design/image-prompts/generated/bonsai-screen-prompts.md`
- `design/generated-images/`

修改提示词配置后重新生成：

```bash
node design/image-prompts/render-screen-prompts.mjs
```
