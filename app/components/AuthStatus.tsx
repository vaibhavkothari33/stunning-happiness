'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading auth...</div>;
  }

  if (session) {
    const user = session.user;
    const userRole = (user as any)?.role;

    const getInitials = (name: string | null | undefined) => {
      if (!name) return 'U';
      const words = name.trim().split(' ');
      if (words.length === 1) return words[0][0].toUpperCase();
      return (words[0][0] + words[1][0]).toUpperCase();
    };

    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          {user?.image ? (
            <Image
              src={user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-700 font-semibold text-lg">
              {getInitials(user?.name)}
            </span>
          )}
        </div>

        <span className="text-gray-800 font-medium">
          {user?.name || user?.email}
        </span>

        {userRole === 'admin' && (
          <Link href="/dashboard" className="text-indigo-600 hover:underline">
            Admin Dashboard
          </Link>
        )}

        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    >
      Sign in
    </button>
  );
}
