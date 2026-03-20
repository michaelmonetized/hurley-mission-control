'use client';

import { useRouter } from 'next/navigation';

export default function SignUp() {
  const router = useRouter();

  const handleTestSignUp = () => {
    // For now, just redirect to sign-in
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600 mb-8">Join HurleyUS Mission Control</p>

        <div className="space-y-4">
          <button
            onClick={handleTestSignUp}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Create Test Account
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
            <p>Full Clerk authentication is coming soon.</p>
            <p className="mt-2">For now, use the test account.</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
