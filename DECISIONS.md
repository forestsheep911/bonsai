# pj-status · 技术决策记录

> 本文档采用 **ADR（Architecture Decision Records）** 风格，记录每一项待决策或已决策的技术议题。
> - 每条决策有自己的编号 `T-xxx`（Tech Decision），独立于 `VISION.md` 中的 `Dx`（产品级决策）。
> - 状态：`待定` / `已定` / `已变更`。
> - 已定的决策如需变更，**新增条目**并标注"取代 T-xxx"，**不要**静默修改历史决策。

---

## 索引

| ID | 议题 | 状态 | 当前结论 |
| --- | --- | --- | --- |
| [T-001](#t-001-数据库选型) | 数据库选型 | 已定 ✅ | Azure Cosmos DB（Free Tier 优先；满则 Serverless 模式） |
| [T-002](#t-002-orm-选型) | ORM 选型 | 已定 ✅ | 不用 ORM：原生 `@azure/cosmos` SDK + Zod 做校验 |
| [T-003](#t-003-后台鉴权方案) | 后台鉴权方案 | 已定 ✅ | Azure SWA 内置 GitHub OAuth + 自定义角色白名单 |
| [T-004](#t-004-图片--封面存储) | 图片 / 封面存储 | 已定 ✅ | Azure Blob Storage（复用 SWA 自带 Storage Account） |
| [T-005](#t-005-部署目标) | 部署目标 | 已定 ✅ | Azure Static Web Apps（Free Tier） |
| [T-006](#t-006-长文--富文本编辑器) | 长文 / 富文本编辑器 | 待定 | 倾向 Markdown + 实时预览 |
| [T-007](#t-007-域名规划) | 域名规划 | 待定 | 上线前再敲 |
| [T-008](#t-008-前端构建链确认-nextjs-vs-vite) | 前端构建链确认（Next.js vs Vite） | 已变更 🔄 | B. Vite + React 19 + shadcn/ui（取代早晨敲定的 A. Next.js） |
| [T-009](#t-009-github-仓库名--可见性) | GitHub 仓库名 / 可见性 | 已定 ✅ | `forestsheep911/bonsai`，public |

---

## T-001 数据库选型

**背景**：单人站，数据量很小（项目数顶天几十几百），但需要"数据库 + 后台"模式，要支持后期加字段、全文搜索、JSON 字段等。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **PostgreSQL（Neon Serverless）** | 生态最完善；JSON / 全文搜索 / 触发器一应俱全；Neon 免费层够用，serverless 自动休眠 | 冷启动有几百 ms 延迟 | ⭐⭐⭐⭐⭐ |
| **PostgreSQL（Supabase）** | 自带后台/权限/Storage/Auth；免费层慷慨 | 功能多用不上反而是负担；锁定到 Supabase 生态 | ⭐⭐⭐⭐ |
| **PostgreSQL（自建 / VPS）** | 完全可控；无外部依赖 | 要自己做备份、监控、升级；运维成本 | ⭐⭐ |
| **SQLite（如 Turso / libSQL）** | 极轻；本地开发零配置；Turso 提供 edge 副本 | 写并发弱；某些复杂查询能力差；ORM 支持略弱 | ⭐⭐⭐ |
| **MySQL（PlanetScale / 自建）** | 老牌稳定；PlanetScale 分支模型酷 | PlanetScale 已取消免费层；功能不如 PG | ⭐⭐ |
| **NoSQL（MongoDB / DynamoDB）** | schema 灵活 | 项目本质是关系型数据（Project ↔ Milestone ↔ Tag）；用 NoSQL 是反向工程 | ⭐ |

**早期推荐**（2026-05-01 决策中）：PostgreSQL on Neon（serverless，免费层）。
早期理由：单人小项目最看重"零运维 + 零成本起步"，Neon 满足；选 Postgres 是给未来留扩展空间。

**最终决策**（2026-05-01 晚）：**Azure Cosmos DB**（Free Tier 优先；额度满则用 Serverless 模式）。

新增候选行（原表未列）：

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Azure Cosmos DB** ✅ | Free Tier 永久免费（每订阅 1 个名额：1000 RU/s + 25 GB）；按 RU 计费可缩到接近 0；与 Azure SWA / Functions 同生态；factory-soon 已在生产中验证 | NoSQL 文档模型；未来若需复杂关系/事务会受限 | ⭐⭐⭐⭐⭐（在 Azure 生态下） |

**变更原因**：
1. T-005 部署改为 Azure SWA（见 T-005 变更记录），整套技术栈进入 Azure 生态。
2. 用户已有 factory-soon 项目使用 `@azure/cosmos` SDK 的成熟经验（见 `api/src/saveStore.ts`），零学习成本。
3. bonsai 数据模型简单（Project 内嵌 Milestone + Tag 数组），文档型 NoSQL 完美适配；Postgres 的关系/事务能力在本项目用不上。
4. Cosmos Free Tier 永久免费，Serverless 按用量计费，对单人站基本 $0/月。
5. 全栈同生态：账单统一、监控统一、零跨云延迟。

**bonsai 数据模型示意**：

```
Container: projects        partitionKey: /userId
{
  id, userId, slug, name, status, summary, story (markdown),
  links: { repo, demo, site, docs },
  tags: ["ai", "tool"],
  milestones: [ { id, type, content, occurredAt } ],   // 内嵌
  metrics: { stars, mrr, dau },
  createdAt, updatedAt
}
```

**状态**：已定 ✅（2026-05-01 晚）。

---

## T-002 ORM 选型

**背景**：Next.js + TypeScript，需要类型安全的数据访问层。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Prisma** | 文档最完善；schema 直观；migrations 工具链好；社区资料多 | 运行时多一层；冷启动稍慢；生成产物较大 | ⭐⭐⭐⭐⭐ |
| **Drizzle** | 极轻；TS-first；性能好；SQL-like API | 心智比 Prisma 重一点；生态较新；migrations 工具不如 Prisma 成熟 | ⭐⭐⭐⭐ |
| **Kysely** | 纯 query builder，零运行时开销 | 偏底层，写起来啰嗦 | ⭐⭐⭐ |
| **TypeORM** | 老牌 | 装饰器写法过时；Bug 较多 | ⭐ |
| **直接写 SQL（postgres.js / pg）** | 最自由 | 类型安全靠手动维护，单人项目时间不划算 | ⭐⭐ |

**早期推荐**（2026-05-01 决策中）：Prisma。
早期理由：单人项目，节省时间和心智 > 极致性能；Prisma 文档对 Next.js 最友好。
早期备选：未来用 Cloudflare Workers / Edge 时考虑 Drizzle。

**最终决策**（2026-05-01 晚）：**不使用 ORM**，直接用原生 `@azure/cosmos` SDK 做数据访问 + **Zod** 做 schema 校验。

**变更原因**：
1. T-001 数据库改为 Cosmos DB（NoSQL 文档库），Prisma / Drizzle / Kysely 这类关系型 ORM 在文档库下已不适用。
2. `@azure/cosmos` SDK 已经提供类型安全的 CRUD 接口（`Container.items.upsert/read/query`），单人小项目无需再加一层抽象。
3. Zod 同时充当 API 入参校验 + 文档 schema 定义 + 前端表单类型来源——一份 schema 多处复用。
4. factory-soon 已经使用此模式（`saveStore.ts` 直接用 `@azure/cosmos`，无 ORM），bonsai 直接复用。

**状态**：已定 ✅（2026-05-01 晚）。

---

## T-003 后台鉴权方案

**背景**：单人站，"管理员"只有"我"一个人。要登录才能进后台增删改项目。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Auth.js (NextAuth) + GitHub OAuth + 邮箱白名单** | 不用自己管密码；只有白名单里的 GitHub 账号能进后台；最贴合开发者身份 | 多一个第三方依赖；首次配 OAuth 略繁 | ⭐⭐⭐⭐⭐ |
| **Auth.js + Magic Link（邮箱）** | 不用记密码；零依赖第三方 | 需要 SMTP / Resend 等邮件服务 | ⭐⭐⭐⭐ |
| **简单账号密码（自管 + bcrypt）** | 最朴素；无外部依赖 | 要自己做安全（限速、bcrypt、CSRF…），单人站也不应该裸写 | ⭐⭐ |
| **HTTP Basic Auth（仅后台路由）** | 极简，nginx/中间件一行配置 | 体验差；浏览器记住密码后无法"登出" | ⭐⭐ |
| **不做登录，后台靠环境变量 + 隐蔽 URL** | 0 代码 | 任何泄漏都裸奔；不推荐 | ⭐ |
| **Clerk / Supabase Auth** | 一站式 | 单人站杀鸡用牛刀 | ⭐⭐ |

**早期推荐**（2026-05-01 决策中）：Auth.js + GitHub OAuth + 邮箱白名单。
早期理由：开发者用 GitHub 登录最自然；白名单确保只有"我"能进；不依赖额外服务。

**最终决策**（2026-05-01 晚）：**Azure SWA 内置认证（`/.auth/login/github`）+ 自定义角色白名单（`admin` 角色）**。

新增候选行（原表未列）：

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Azure SWA Built-in Auth (GitHub)** ✅ | 一行 URL 完成登录（`/.auth/login/github`）；零代码集成；内置角色管理；Functions 通过 `x-ms-client-principal` header 自动拿到用户身份 | 锁定 SWA 平台；自定义流程少 | ⭐⭐⭐⭐⭐（在 SWA 部署下） |

**变更原因**：
1. T-005 部署改为 Azure SWA，平台自带的 Built-in Auth 覆盖了 99% 的需求。
2. 不再需要 Auth.js / NextAuth 这一层第三方依赖，省掉一个 npm 包 + OAuth App 注册 + Session 存储 + 调试成本。
3. `/.auth/login/github` 跳转登录、`x-ms-client-principal` header 解析、`allowedRoles` 路由保护这套机制 factory-soon 已经在生产中跑（见 `api/src/auth.ts` 与 `staticwebapp.config.json`），零摸索成本。
4. 单人白名单实现：在 Azure Portal SWA 的"角色管理"中给我的 GitHub 账号配 `admin` 自定义角色，敏感接口 `allowedRoles: ["admin"]` 即可。

**状态**：已定 ✅（2026-05-01 晚）。

---

## T-004 图片 / 封面存储

**背景**：项目封面、截图、长文里嵌入的图片，需要可上传、可访问。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Vercel Blob** | 与 Next.js / Vercel 集成最丝滑；上传 SDK 简单 | 免费额度小；锁定 Vercel | ⭐⭐⭐⭐ |
| **Cloudflare R2** | 免费额度大（10GB 存储 / 无出站费）；S3 兼容；可挂自有域名 | 需多一层 SDK 配置；和 Vercel 跨平台 | ⭐⭐⭐⭐⭐ |
| **AWS S3** | 行业标准 | 出站流量收费；配置繁琐；超出免费层后贵 | ⭐⭐ |
| **Supabase Storage** | 如果数据库用 Supabase，一站式 | 否则没必要 | ⭐⭐⭐（仅当 T-001 选 Supabase） |
| **GitHub 仓库（图床）** | 零成本 | 滥用风险；不适合用户上传 | ⭐ |
| **本地文件系统（部署所在机器）** | 最简单 | Vercel/Cloudflare 等 serverless 平台不支持持久化文件系统 | ⭐ |
| **图床第三方（imgur / sm.ms）** | 零开发 | 不可靠；可能挂掉；图片所有权不在自己 | ⭐ |

**早期推荐**（2026-05-01 决策中）：Cloudflare R2。次选 Vercel Blob。
早期理由：免费额度大、可移植、可挂自定义域名；S3 兼容意味着未来切换成本低。

**最终决策**（2026-05-01 晚）：**Azure Blob Storage**（直接复用 SWA Functions 自带的 Storage Account，连接串走 `AzureWebJobsStorage` 环境变量，无需另开 Storage 资源）。

新增候选行（原表未列）：

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Azure Blob Storage** ✅ | 与 SWA / Functions 同账号同生态；可直接复用 SWA 自带的 `AzureWebJobsStorage` Storage Account，0 额外资源；Hot tier ~$0.018/GB·月 | 出站流量按 GB 收费（小流量基本免费层覆盖）；管理 UI 复杂一些 | ⭐⭐⭐⭐⭐（在 Azure 生态下） |

**变更原因**：
1. T-005 部署改为 SWA，每个 SWA 都自带一个绑定的 Storage Account，bonsai 不需要单独开 R2 账号。
2. factory-soon 已在生产中使用此模式（见 `api/src/analysisStore.ts`，复用 `AzureWebJobsStorage` 连接串）。
3. 国内访问性能：Azure 国际版与 R2 都未墙、速度相近；同生态优于跨云。
4. 月成本估算：bonsai 几百张项目封面图 ≈ $0.05/月，可忽略。

**状态**：已定 ✅（2026-05-01 晚）。

---

## T-005 部署目标

**背景**：站点本身（Next.js）需要部署到某处。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Vercel** | Next.js 官方平台；CI/CD 自动；预览部署；免费层够用 | 出海可能需翻墙才能流畅访问 dashboard；超量后贵 | ⭐⭐⭐⭐⭐ |
| **Cloudflare Pages + Workers** | 免费层慷慨；全球 edge；和 R2 同生态 | Next.js 在 CF 上需要 OpenNext 适配，部分功能受限 | ⭐⭐⭐⭐ |
| **Netlify** | 类似 Vercel 但 Next.js 支持稍弱 | 没特别理由不用 Vercel | ⭐⭐⭐ |
| **自有 VPS（Docker / pm2）** | 完全可控；可跑任意后端 | 自己做反向代理、SSL、备份、监控 | ⭐⭐ |
| **Docker 自部署到家用 NAS / 云服务器** | 数据完全在自己手里 | 维护成本；公网访问需 DDNS / frp | ⭐⭐ |

**早期推荐**（2026-05-01 决策中）：Vercel。
早期理由：Next.js + Vercel 是黄金组合，单人项目时间更值钱；超量了再迁也来得及。

**最终决策**（2026-05-01 晚）：**Azure Static Web Apps（Free Tier）**。

新增候选行（原表的重大遗漏：完全没列 Azure 系列，是早期推荐的盲点）：

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **Azure Static Web Apps (SWA)** ✅ | Free Tier 慷慨（100 GB/月出站、0.5 GB 静态、100k Functions 调用）；自带 CDN / HTTPS / PR 预览 / Built-in Auth / Managed Functions；用户已 100% 熟悉（factory-soon 在用）；国际版未墙 | 不适合完整 Next.js（SSR/Server Components 与 SWA 设计冲突，仅 Hybrid preview 支持） | ⭐⭐⭐⭐⭐（搭 Vite SPA） |
| **Azure Container Apps（ACA）Consumption** | 真正 scale-to-0；适合 Next.js Standalone + Docker；免费额度足够单人站 | 配 Docker + ACR + GHA 链路有学习成本 | ⭐⭐⭐⭐（搭 Next.js） |
| **Azure App Service（B1+）** | Always-on 无冷启动；Node 直跑无需 Docker | 不能缩到 0；最低 ~$13/月固定 | ⭐⭐ |
| **Azure Functions（独立）** | 按调用计费 | Next.js 不为 Functions 设计，App Router 兼容差 | ⭐ |

**变更原因（核心）**：
1. **怕 Vercel 触红线被墙**（用户首要顾虑）：bonsai 是 build-in-public 的对外站，未来项目内容若被审查认为越界，Vercel 部署可能被国内整体阻断；Azure 国际版至今未墙，是更稳妥的"政治避险"选择。
2. **复用现有经验**：用户的 factory-soon 项目（`C:\Users\fores\dev\games\factory-soon\main`）已在生产中跑同一套（SWA + Vite + Functions + Cosmos + Blob + Built-in Auth），bonsai 直接复用 100% 的部署/鉴权/数据访问经验。
3. **同生态便利**：T-001/T-003/T-004 全部进入 Azure，账单/监控/连接串管理统一。
4. **scale-to-0 + 极低成本**：SWA Free + Functions 100k 调用 + Cosmos Free Tier + Blob 几乎免费 ≈ 单人站长期 $0~$0.1/月，匹配用户"可接受零星费用、不要固定付费"的预算。
5. **冷启动可接受**：用户明确表态"不怕初次体验差"，Functions 1-2 秒冷启动可接受。
6. **代价**：放弃 SSR / SEO，但本项目访客主要靠主动分享链接，搜索引擎流量不是核心需求（详见 T-008 变更记录）。

**关联决策（这次"全栈 Azure 化"一并联动调整）**：
- T-001 数据库 → Cosmos DB（取代 Neon Postgres）
- T-002 ORM → 不用 ORM，原生 SDK + Zod（取代 Prisma）
- T-003 鉴权 → SWA 内置 Auth（取代 Auth.js）
- T-004 图片存储 → Azure Blob（取代 Cloudflare R2）
- T-008 构建链 → Vite（取代 Next.js）
- VISION.md D3 前端框架 → Vite + React + shadcn/ui

**状态**：已定 ✅（2026-05-01 晚）。

---

## T-006 长文 / 富文本编辑器

**背景**：项目详情页有"故事/长文"字段，可能包含图片、代码块、链接。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **纯 Markdown + 实时预览** | 开发者最熟；可移植；可 diff；轻量 | 非技术用户不友好（但本项目用户就是开发者） | ⭐⭐⭐⭐⭐ |
| **MDX** | Markdown + 嵌入 React 组件，玩法多 | 编辑/存储复杂；安全考虑（执行 JSX） | ⭐⭐⭐ |
| **Tiptap（富文本 WYSIWYG）** | 体验现代；可扩展 | 集成成本高；存储 JSON / HTML 不如 markdown 通用 | ⭐⭐⭐ |
| **Novel / BlockNote / Plate** | Notion 风格 block 编辑 | 一样的可移植性问题；上手成本 | ⭐⭐⭐ |
| **TinyMCE / CKEditor** | 老牌富文本 | 体积大；样式陈旧 | ⭐ |

**推荐**：纯 Markdown + 实时预览（用 `react-markdown` 或 `@uiw/react-md-editor`）。
**理由**：
1. 受众本身是开发者，Markdown 是母语。
2. 内容数据可移植：未来想换框架 / 改静态站，markdown 一行不用改。
3. 实现成本最低。

**状态**：待用户确认 ⬜

---

## T-007 域名规划

**背景**：站点需要一个能对外分享的 URL。

| 候选 | 优点 | 缺点 | 适用度 |
| --- | --- | --- | --- |
| **暂用 Vercel 临时域名（`xxx.vercel.app`）** | 0 成本 0 配置；上线即用 | 不正式；不利于品牌 | ⭐⭐⭐⭐（v0 / 内测阶段） |
| **绑定独立顶级域名** | 专业；品牌一致 | 要买域名（约 $10/年）；要配 DNS | ⭐⭐⭐⭐⭐（公开发布后） |
| **绑定个人主域名的子域名（如 `pj.<your>.com`）** | 复用已有域名；表达"这是我个人项目展示页" | 需已有主域名 | ⭐⭐⭐⭐⭐（如果有主域名） |

**推荐路径**：
1. **第 0 阶段（开发 + 内测）**：直接用 vercel 临时域名。
2. **第 1 阶段（公开）**：绑定子域名 / 独立域名。

**待你回答**：
- 你有现成的个人域名吗？想用作主域名还是子域名？

**状态**：待用户确认 ⬜

---

## T-008 前端构建链确认（Next.js vs Vite）

**背景**：上一轮你提到 "nextjs。shadcn vite"。Next.js 和 Vite 通常是二选一（Next.js 自带构建系统，不再用 Vite）。需要明确。

| 候选 | 适用情况 |
| --- | --- |
| **A. Next.js（App Router）+ shadcn/ui** | 推荐；单人项目要后台/SSR/Server Actions 都顺手 |
| **B. Vite + React + shadcn/ui** | 纯 SPA，没有 SSR；做后台得另起一个后端服务 |
| **C. Next.js + Vite 同时用** | 一般不会这样组合 |

**早期推荐**：A. Next.js + shadcn/ui。
早期理由：D2（数据库 + 后台）天然需要服务端能力，Next.js Server Actions 一站搞定。

**最终决策**（2026-05-01 晚）：**B. Vite + React 19 + shadcn/ui**（取代早晨敲定的 A. Next.js）。

**变更原因**：
1. 用户提到原本计划部署到 Azure（顾虑 Vercel 被墙），并展示 factory-soon 项目实际使用 Azure SWA 部署。
2. SWA 的设计哲学（前端静态 CDN + 独立 Functions API）与 Next.js App Router（SSR + Server Components + Server Actions 紧耦合）有根本冲突，
   微软对 Next.js 仅有 "Hybrid preview" 级别支持，新特性永远慢半拍、问题难排查。
3. 反向验证：bonsai 不需要 SSR——访客来源以"主动分享链接"为主（朋友/雇主/转发），搜索引擎自然流量不是核心需求；SPA + 静态 meta + sitemap.xml + Open Graph 完全够用。
4. 用户已 100% 熟悉 Vite + Functions 这套，复用 factory-soon 脚手架几乎"开箱即用"。
5. shadcn/ui 官方同时支持 Next.js 和 Vite 两条路径，组件层无切换成本。

**状态**：已变更 🔄（2026-05-01 晚）。最终结论：**B. Vite + React 19 + shadcn/ui**。
保留早期 A 决策记录用于追溯，不做静默修改（遵循 ADR 规范）。

---

## T-009 GitHub 仓库名 / 可见性

**背景**：项目需要一个远程 GitHub 仓库承载源代码与 build-in-public 进展。

**决策**：
- **仓库全称**：`forestsheep911/bonsai`
- **可见性**：public
- **核心隐喻**：盆景——未长成参天大树前的 mini 版，又有展览供观赏的意境
- **同步影响**：项目对外名称、状态机显示词、视觉语言都围绕"盆景"展开（见 VISION.md §5.2、§11）

**为什么选 `bonsai`**：
1. 概念精准——"未成熟但已成形并值得展示"，完美匹配项目本质。
2. 国际通用，URL 优雅，单字便于品牌传播。
3. 东方意象，避开 indie 圈一水的英文短词命名（ship/forge/lab/yard），辨识度高。
4. 隐喻可延伸至全产品语言（种子→嫩芽→幼苗→成型→老桩→休眠→入库）。

**为什么选 public**：
- 站点本身就是对外展示用，仓库 public 是 build-in-public 文化的自然延伸。
- 单人项目，仓库公开降低协作摩擦，未来收 PR / Issue 也方便。

**状态**：已定 ✅（2026-05-01）。

---

## 决策推进顺序建议

> 不要并行讨论所有决策，按下面顺序逐项敲定，每项决策都依赖前一项的结果：

1. ~~**T-008**（Next.js vs Vite）— 基础前提~~ ✅（已变更：A → B，详见 T-008）
2. ~~**T-009**（GitHub 仓库名 / 可见性）~~ ✅
3. ~~**T-005**（部署目标）— 实际成为最关键决策，回头驱动 T-001/T-002/T-003/T-004/T-008 联动调整~~ ✅
4. ~~**T-001**（数据库）~~ ✅
5. ~~**T-002**（ORM）~~ ✅
6. ~~**T-003**（鉴权）~~ ✅
7. ~~**T-004**（图片存储）~~ ✅
8. **T-006**（长文 / 富文本编辑器）— 较独立 ⬅️ 下一个推进
9. **T-007**（域名规划）— 上线前再敲

> 至此 v1 上线前的"基础设施层"决策全部敲定。下一步可以开始动手搭脚手架了
> （pnpm + Vite + React 19 + Tailwind + shadcn/ui，并把 factory-soon 的 `api/` 目录结构与 GitHub Actions 抄过来）。

---

_最后更新：2026-05-01 晚（"全栈 Azure 化"决策落锤：T-001 ~ T-005 + T-008 联动调整）_
