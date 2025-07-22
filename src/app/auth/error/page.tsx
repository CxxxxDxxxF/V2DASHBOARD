'use client';

import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
          Authentication Error
        </h2>
        <p className="mt-2 text-gray-600">
          Something went wrong during sign in. Please try again or contact your administrator if the problem persists.
        </p>
        <div className="mt-6">
          <Link href="/auth/signin" className="text-rutgers-scarlet hover:text-red-700 font-medium">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 