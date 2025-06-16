// app/quiz/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function QuizEntryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to start quiz');
        return;
      }

      // Redirect to the actual quiz page with the attempt ID
      router.push(`/quiz/${data.attemptId}`);
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-8">Ready to Test Your Knowledge?</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleStartQuiz}
        disabled={loading || status === 'unauthenticated'}
        className="bg-blue-600 text-white px-8 py-4 rounded-xl text-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting Quiz...' : 'Start Quiz'}
      </button>
      {status === 'unauthenticated' && (
        <p className="mt-4 text-gray-600">Please log in to start a quiz.</p>
      )}
    </div>
  );
}