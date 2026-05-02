# Bonsai 项目协议与上报标准

> 这份文档定义 Bonsai 里“一个项目应该长什么样”，以及项目如何把自己的状态主动上报给 Bonsai。
> 目标是把 Bonsai 从“手动维护的后台”改成“项目自报、站点聚合”的系统。

## 1. 核心判断

Bonsai 不应该优先做成一个内容后台，而应该做成一个**项目协议层**。

项目自己维护自己的事实数据，Bonsai 负责：

1. 接收项目上报
2. 校验结构
3. 存储快照和历史
4. 生成公开展示页、时间线和统计视图

这样做的原因很直接：

- 手动改后台效率低，且容易和真实项目状态脱节
- 项目状态、里程碑、指标本来就更适合由项目本身生成
- 协议清楚之后，前端、API、CLI、CI 都能围绕同一份结构演进

## 2. 设计原则

1. **项目自己说话**  
   项目仓库或部署流程负责提供事实，Bonsai 不替项目编造状态。

2. **状态优先于文案**  
   用户最先关心的是项目现在处于什么阶段，而不是长篇说明。

3. **结构化优先于手工录入**  
   能通过 `bonsai.json`、CI 或 API 自动生成的字段，不优先放进手填后台。

4. **允许缺省，但不允许含糊**  
   字段可以为空，但一旦提供就必须遵守统一格式。

5. **历史要保留**  
   项目当前状态重要，状态变化过程同样重要。

## 3. 项目标准对象

项目标准对象分成三层：

- `ProjectManifest`：项目基础声明，适合长期存在
- `ProjectReport`：一次上报事件，适合 CI 或部署时发送
- `ProjectSnapshot`：Bonsai 处理后的当前视图，供前端展示

### 3.1 `ProjectManifest`

这是项目的基础描述，适合放在仓库根目录的 `bonsai.json`。

最少应包含：

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `tags`
- `links`
- `story`
- `createdAt`
- `updatedAt`

推荐字段：

- `coverImage`
- `metrics`
- `milestones`
- `visibility`
- `owner`
- `source`

参考当前实现里的领域模型，现有字段基本已经覆盖：

- `src/domain/project.ts`
- `src/data/mock.ts`

### 3.2 `ProjectReport`

这是“项目主动上报”的事件对象，适合 CI、部署脚本、机器人提交。

一个报告通常只包含本次变更相关的内容，比如：

- 状态变更
- 新增里程碑
- 指标刷新
- 构建结果
- 部署结果

### 3.3 `ProjectSnapshot`

这是 Bonsai 最终保存和前端展示的结果。

它是上报后的合并态，不要求和原始 manifest 完全一致，但必须可追溯到来源。

## 4. 字段标准

### 4.1 身份字段

- `id`：稳定主键，建议短且不可变
- `slug`：展示和路由用的短路径，建议不可变或低频变更
- `name`：项目名称
- `owner`：项目归属人或团队标识
- `userId`：Bonsai 内部持有者标识

### 4.2 展示字段

- `summary`：一句话简介
- `coverImage`：封面图 URL
- `tags`：标签数组
- `story`：长文说明，建议 Markdown

### 4.3 生命周期字段

- `status`：当前状态
- `createdAt`：创建时间
- `updatedAt`：更新时间
- `milestones`：时间线事件

当前状态枚举建议与现有 schema 对齐：

- `idea`
- `prototype`
- `mvp`
- `live`
- `mature`
- `paused`
- `archived`

### 4.4 链接字段

链接统一用数组，而不是在对象上堆很多可选字段。

每条链接建议包含：

- `type`
- `label`
- `url`

推荐类型：

- `website`
- `github`
- `demo`
- `docs`
- `blog`
- `other`

### 4.5 指标字段

指标统一用结构化数组，不要在展示层写死某几个文案。

每条指标建议包含：

- `key`
- `label`
- `value`
- `unit`

常见指标：

- 用户数
- MRR
- Stars
- 访问量
- DAU

### 4.6 健康字段

这部分主要给自动上报用：

- `buildStatus`
- `deployStatus`
- `lastCommitAt`
- `lastDeployAt`
- `repoHealth`

这组字段不一定是 v1 必备，但建议协议预留。

## 5. API 标准

API 的角色不是“后台 CRUD 的唯一入口”，而是“项目上报和读取的标准接口”。

### 5.1 读取接口

- `GET /api/projects`
- `GET /api/projects/:slug`
- `GET /api/timeline`

用途：

- 前端列表页读取项目集合
- 详情页读取单个项目
- 时间线页读取跨项目事件流

### 5.2 上报接口

- `POST /api/projects/report`

用途：

- CI/CD 在部署后上报最新状态
- 项目脚本在发布时上报新里程碑
- 自动化工具刷新指标

### 5.3 校验接口

- `GET /api/projects/schema`

用途：

- 给项目方提供可生成的 schema
- 方便调试和做文档/代码生成

## 6. `bonsai.json` 建议

建议每个项目仓库根目录都能放一个 `bonsai.json`。

示例：

```json
{
  "id": "prompt-shelf",
  "slug": "prompt-shelf",
  "name": "Prompt Shelf",
  "summary": "AI 提示词管理与复用工具",
  "status": "mature",
  "tags": ["AI", "工具"],
  "links": [
    { "type": "github", "label": "GitHub", "url": "https://github.com/example/prompt-shelf" }
  ],
  "metrics": [
    { "key": "users", "label": "活跃用户", "value": 1234, "unit": "人" }
  ],
  "milestones": [
    {
      "id": "launch-2026-05-01",
      "type": "launch",
      "title": "首次上线",
      "occurredAt": "2026-05-01T12:00:00Z"
    }
  ],
  "story": "项目故事写在这里。",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-05-01T12:00:00Z",
  "visibility": "public"
}
```

## 7. 上报方式

### 7.1 静态文件拉取

适合最早期阶段。

Bonsai 读取仓库里的 `bonsai.json`，或者从项目构建产物中导入。

优点：

- 简单
- 可读
- 容易调试

缺点：

- 不能天然记录构建后状态
- 需要额外同步逻辑

### 7.2 CI 主动 POST

适合上线后的自动化上报。

项目部署完成后，CI 直接调用 `POST /api/projects/report`。

优点：

- 能上报构建、部署、发布结果
- 可以自动刷新时间线和状态

缺点：

- 需要 token
- 需要幂等和重试设计

### 7.3 人工补充

只作为例外，不作为主路径。

适合补历史项目、修复脏数据、补一段故事，不适合日常更新。

## 8. 数据归属与优先级

建议按这个优先级合并数据：

1. `bonsai.json` 或项目源头数据
2. CI / API 上报的动态状态
3. Bonsai 内部补充字段

原则是：

- 项目方提供的基础事实优先
- 运行时状态可覆盖静态默认值
- Bonsai 只补展示所需，不反向篡改原始事实

## 9. 校验规则

最低限度建议校验：

- `id`、`slug`、`name`、`summary` 非空
- `status` 必须属于枚举
- `url` 必须是合法 URL
- `createdAt`、`updatedAt`、`occurredAt` 必须是 ISO 时间
- `milestones` 按时间排序或可排序
- `slug` 在全站唯一

## 10. 版本演进

### v0

- 继续使用 mock 数据
- 前端先按现有领域模型展示

### v1

- 引入 `bonsai.json`
- 增加项目读取接口
- 项目列表、详情、时间线都从统一协议读取

### v1.5

- 增加 `POST /api/projects/report`
- 允许 CI / 部署后自动上报

### v2

- 增加历史事件存储
- 支持报告日志、失败日志、指标趋势
- 逐步减少手工维护

## 11. 暂不做的事

- 不做重后台 CRUD 作为核心交互
- 不把“内容编辑”作为唯一事实来源
- 不在协议里塞协作、评论、工单等复杂功能
- 不把字段设计成一开始就强绑定某个前端页面

## 12. 与现有代码的关系

当前仓库里的这几个文件已经在为协议做铺垫：

- `src/domain/project.ts`
- `src/data/mock.ts`
- `src/lib/projectStats.ts`
- `src/pages/Overview.tsx`
- `src/pages/Timeline.tsx`

现阶段最合理的路线是：

1. 先把协议固定下来
2. 再把前端展示完全对齐协议
3. 最后补 API 和上报链路

## 13. 待定问题

下面这些点后面需要继续定：

- `bonsai.json` 是否允许项目自定义扩展字段
- `id` 和 `slug` 是否允许分离管理
- 是否需要存储完整上报历史
- `metrics` 是否要定义更严格的单位规范
- 公开项目和私密项目的边界怎么表示

