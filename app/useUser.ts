'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';

export interface User {
  _id: Id<'users'>;
  kind: 'human' | 'agent';
  clerkId?: string;
  agentId?: string;
  displayName: string;
  machineId?: string;
  active: boolean;
  _creationTime: number;
}

export function useUser() {
  const [userId, setUserId] = useState<Id<'users'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const testUserId = localStorage.getItem('testUserId');

    if (storedUserId) {
      setUserId(storedUserId as Id<'users'>);
      setIsLoading(false);
    } else if (testUserId) {
      // Sync test user with Convex
      syncTestUser(testUserId);
    }
  }, []);

  // Fetch user data from Convex
  const user = useQuery(
    api.queries.getUserById,
    userId ? { userId } : 'skip'
  ) as User | null | undefined;

  const syncTestUser = async (testUserId: string) => {
    try {
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: testUserId,
          displayName: localStorage.getItem('testUserName') || 'Test User',
        }),
      });

      if (!response.ok) throw new Error('Failed to sync user');

      const data = await response.json();
      const convexUserId = data.userId as Id<'users'>;
      localStorage.setItem('userId', convexUserId);
      setUserId(convexUserId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync user');
      setIsLoading(false);
    }
  };

  return {
    user,
    userId,
    isLoading: isLoading || (userId && !user),
    error,
  };
}
