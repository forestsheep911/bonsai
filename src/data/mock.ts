import { projectListSchema, type Project } from "@/domain/project";

export const mockProjects: Project[] = projectListSchema.parse([
  {
    id: "factory-soon",
    userId: "owner",
    slug: "factory-soon",
    name: "Factory Soon",
    summary: "小型工厂建造与管理模拟器。",
    status: "live",
    tags: ["自动化", "模拟", "策略"],
    coverImage:
      "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80",
    links: [
      {
        type: "demo",
        label: "Demo",
        url: "https://demo.factorysoon.com",
      },
      {
        type: "github",
        label: "GitHub",
        url: "https://github.com/bonsai-dev/factorysoon",
      },
    ],
    metrics: [
      {
        key: "users",
        label: "活跃用户",
        value: 1234,
      },
      {
        key: "mrr",
        label: "月收入",
        value: 2980,
        unit: "¥",
      },
      {
        key: "stars",
        label: "Stars",
        value: 1567,
      },
    ],
    milestones: [
      {
        id: "factory-soon-live",
        type: "status_change",
        title: "状态变更",
        occurredAt: "2024-05-18T10:24:00Z",
        fromStatus: "mvp",
        toStatus: "live",
      },
      {
        id: "factory-soon-launch",
        type: "launch",
        title: "上线",
        description: "公开 Demo 上线",
        occurredAt: "2024-05-18T00:00:00Z",
      },
    ],
    story: `Factory Soon 是一个小型自动化工厂游戏原型，灵感来自经典的自动化建造类游戏。

目标是用最少的系统表达工厂建造的核心乐趣：规划、连接、优化、扩展。

当前版本专注核心循环与可玩性验证，采用轻量级美术与简洁 UI，便于快速迭代。`,
    isPublic: true,
    createdAt: "2024-03-18T00:00:00Z",
    updatedAt: "2024-05-28T00:00:00Z",
  },
  {
    id: "prompt-shelf",
    userId: "owner",
    slug: "prompt-shelf",
    name: "Prompt Shelf",
    summary: "AI 提示词管理与复用工具，收集、分类、检索更高效。",
    status: "mature",
    tags: ["工具", "AI"],
    links: [
      {
        type: "github",
        label: "GitHub",
        url: "https://github.com/bonsai-dev/promptshelf",
      },
    ],
    metrics: [],
    milestones: [
      {
        id: "prompt-shelf-template-import",
        type: "milestone",
        title: "新增提示词模板与导入功能",
        occurredAt: "2024-05-26T12:00:00Z",
      },
    ],
    story: "为了解决每天复制粘贴提示词的烦恼而做的小工具。",
    isPublic: true,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-05-26T00:00:00Z",
  },
  {
    id: "weekend-prototypes",
    userId: "owner",
    slug: "weekend-prototypes",
    name: "周末原型",
    summary: "周末灵感的快速验证集合。",
    status: "prototype",
    tags: ["实验"],
    links: [],
    metrics: [],
    milestones: [],
    story: "各种脑洞大开但还没成型的周末小实验合集。",
    isPublic: true,
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2024-05-18T00:00:00Z",
  },
]);
