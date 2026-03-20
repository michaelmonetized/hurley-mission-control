'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [testUserId] = useState('user_test_001');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Sync user with Convex
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: testUserId,
          displayName: 'Test User',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user');
      }

      const data = await response.json();
      const userId = data.userId;

      // Store in localStorage
      localStorage.setItem('testUserId', testUserId);
      localStorage.setItem('testUserName', 'Test User');
      localStorage.setItem('userId', userId);

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Control</h1>
        <p className="text-gray-600 mb-8">Real-time team communication for HurleyUS</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleTestSignIn}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition ${
              isLoading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? '⟳ Signing in...' : 'Sign In with Test Account'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Clerk Auth Coming Soon</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Note: Clerk authentication keys are being configured.</p>
            <p className="mt-2">Use test account for development.</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Don't have an account?{' '}
          <a href="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
