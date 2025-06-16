// components/AuthStatus.tsx
'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading auth...</div>;
  }

  if (session) {
    const userRole = (session.user as any)?.role;
    return (
      <div className="flex items-center space-x-2">
        <span>Hello, {session.user?.name || session.user?.email}</span>
        {userRole === 'admin' && (
          <Link href="/dashboard" className="text-white hover:underline">
            Admin Dashboard
          </Link>
        )}
        <button onClick={() => signOut()} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
      Sign in
    </button>
  );
}