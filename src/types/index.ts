export type ProjectStatus = 'idea' | 'prototype' | 'mvp' | 'live' | 'mature' | 'paused' | 'archived';

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  status: ProjectStatus;
  tags: string[];
  coverImage?: string;
  links: {
    website?: string;
    github?: string;
    demo?: string;
    docs?: string;
  };
  metrics?: {
    users?: number;
    mrr?: number;
    stars?: number;
  };
  story: string;
  createdAt: string; // ISO date string
  updatedAt: string;
}

export type TimelineEventType = 'status_change' | 'milestone' | 'idea_record' | 'launch' | 'pause' | 'review';

export interface TimelineEvent {
  id: string;
  projectId: string;
  type: TimelineEventType;
  date: string; // ISO date
  title: string;
  description?: string;
  fromStatus?: ProjectStatus;
  toStatus?: ProjectStatus;
}
