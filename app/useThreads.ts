'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

export interface Thread {
  _id: Id<'threads'>;
  kind: 'dm' | 'group' | 'project' | 'ops';
  title: string;
  projectId?: Id<'projects'>;
  members: Id<'users'>[];
  archived: boolean;
  type?: 'dm' | 'group' | 'project' | 'ops';
  description?: string;
  _creationTime: number;
}

export function useThreads(userId: Id<'users'> | null) {
  const threads = useQuery(
    api.queries.getThreads,
    userId ? { userId } : 'skip'
  ) as Thread[] | null | undefined;

  return {
    threads: threads || [],
    isLoading: threads === undefined,
  };
}
