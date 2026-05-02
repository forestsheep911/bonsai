import { useEffect, useState } from "react";
import type { ProjectSnapshot } from "@/domain/project";
import type { TimelineEvent } from "@/lib/projectStats";
import {
  fallbackProjectSnapshots,
  fallbackTimelineEvents,
  listProjectSnapshots,
  listProtocolTimeline,
  readProjectSnapshot,
  type ProjectDataSource,
} from "@/lib/projectApi";

interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  source: ProjectDataSource;
}

export function useProjectList() {
  const [state, setState] = useState<AsyncState<ProjectSnapshot[]>>({
    data: fallbackProjectSnapshots,
    isLoading: true,
    source: "mock",
  });

  useEffect(() => {
    const controller = new AbortController();

    void listProjectSnapshots(controller.signal).then((result) => {
      if (!controller.signal.aborted) {
        setState({
          data: result.projects,
          isLoading: false,
          source: result.source,
        });
      }
    });

    return () => controller.abort();
  }, []);

  return state;
}

export function useProjectSnapshot(slug: string | undefined) {
  const [state, setState] = useState<AsyncState<ProjectSnapshot | null>>({
    data:
      fallbackProjectSnapshots.find(
        (project) => project.slug === slug || project.id === slug,
      ) ?? null,
    isLoading: true,
    source: "mock",
  });

  useEffect(() => {
    if (!slug) {
      return;
    }

    const controller = new AbortController();

    void readProjectSnapshot(slug, controller.signal).then((result) => {
      if (!controller.signal.aborted) {
        setState({
          data: result.project,
          isLoading: false,
          source: result.source,
        });
      }
    });

    return () => controller.abort();
  }, [slug]);

  return state;
}

export function useTimelineEvents() {
  const [state, setState] = useState<AsyncState<TimelineEvent[]>>({
    data: fallbackTimelineEvents,
    isLoading: true,
    source: "mock",
  });

  useEffect(() => {
    const controller = new AbortController();

    void listProtocolTimeline(controller.signal).then((result) => {
      if (!controller.signal.aborted) {
        setState({
          data: result.events,
          isLoading: false,
          source: result.source,
        });
      }
    });

    return () => controller.abort();
  }, []);

  return state;
}
