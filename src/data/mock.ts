import type { Project, TimelineEvent } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Factory Soon',
    shortDescription: '小型工厂建造与管理模拟器。',
    status: 'live',
    tags: ['自动化', '模拟', '策略'],
    coverImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80',
    links: {
      demo: 'https://demo.factorysoon.com',
      github: 'https://github.com/bonsai-dev/factorysoon'
    },
    metrics: {
      users: 1234,
      mrr: 2980,
      stars: 1567
    },
    story: `Factory Soon 是一个小型自动化工厂游戏原型，灵感来自经典的自动化建造类游戏。

目标是用最少的系统表达工厂建造的核心乐趣：规划、连接、优化、扩展。

当前版本专注核心循环与可玩性验证，采用轻量级美术与简洁 UI，便于快速迭代。`,
    createdAt: '2024-03-18T00:00:00Z',
    updatedAt: '2024-05-28T00:00:00Z'
  },
  {
    id: '2',
    name: 'Prompt Shelf',
    shortDescription: 'AI 提示词管理与复用工具，收集、分类、检索更高效。',
    status: 'mature',
    tags: ['工具', 'AI'],
    links: {
      github: 'https://github.com/bonsai-dev/promptshelf'
    },
    story: '为了解决每天复制粘贴提示词的烦恼而做的小工具。',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-05-26T00:00:00Z'
  },
  {
    id: '3',
    name: '周末原型',
    shortDescription: '周末灵感的快速验证集合',
    status: 'prototype',
    tags: ['实验'],
    links: {},
    story: '各种脑洞大开但还没成型的周末小实验合集。',
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-05-18T00:00:00Z'
  }
];

export const mockEvents: TimelineEvent[] = [
  {
    id: 'e1',
    projectId: '1',
    type: 'status_change',
    date: '2024-05-18T10:24:00Z',
    title: '状态变更',
    fromStatus: 'mvp',
    toStatus: 'live'
  },
  {
    id: 'e2',
    projectId: '1',
    type: 'launch',
    date: '2024-05-18T00:00:00Z',
    title: '上线',
    description: '公开 Demo 上线'
  },
  {
    id: 'e3',
    projectId: '2',
    type: 'milestone',
    date: '2024-05-26T12:00:00Z',
    title: '新增提示词模板与导入功能'
  }
];
