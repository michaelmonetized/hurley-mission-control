'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated, otherwise redirect to sign-in
    const testUserId = localStorage.getItem('testUserId');
    if (testUserId) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}
