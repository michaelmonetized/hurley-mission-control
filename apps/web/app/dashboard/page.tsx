'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../useUser';
import { useThreads } from '../useThreads';

export default function DashboardPage() {
  const router = useRouter();
  const { userId, isLoading: userLoading } = useUser();
  const { threads, isLoading: threadsLoading } = useThreads(userId);

  // Ensure user is authenticated
  useEffect(() => {
    if (!userLoading && !userId) {
      router.push('/sign-in');
    }
  }, [userId, userLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
            <p className="text-sm text-gray-500">Team Communication</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('testUserId');
              router.push('/sign-in');
            }}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Threads</h2>

          {userLoading || threadsLoading ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">Loading threads...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">No threads yet</p>
              <p className="text-sm text-gray-400">Create a thread to start messaging</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {threads.map((thread) => (
                <Link
                  key={thread._id}
                  href={`/dashboard/${thread._id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-900 truncate">{thread.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {thread.description || 'No description'}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {thread.kind === 'dm' && '👤 Direct Message'}
                      {thread.kind === 'group' && '👥 Group Thread'}
                      {thread.kind === 'project' && '📌 Project Thread'}
                      {thread.kind === 'ops' && '⚙️ Operations'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">{threads?.length || 0}</p>
            <p className="text-sm text-gray-600">Active Threads</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">✓</p>
            <p className="text-sm text-gray-600">Real-Time Polling</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">2s</p>
            <p className="text-sm text-gray-600">Message Refresh Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
