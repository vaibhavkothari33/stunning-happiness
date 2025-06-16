// app/dashboard/questions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IQuestion } from '@/models/Question'; // Assuming types

export default function AdminQuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (session.user as any)?.role !== 'admin') {
      router.push('/auth/login'); // Redirect unauthorized
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/quiz/questions');
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch questions');
          return;
        }
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to delete question');
        return;
      }
      setQuestions(questions.filter((q) => q._id !== id));
      alert('Question deleted successfully!');
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('An unexpected error occurred during deletion.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-6">Manage Questions</h1>
      <div className="mb-6">
        <Link href="/dashboard/questions/add" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors">
          Add New Question
        </Link>
      </div>

      {questions.length === 0 ? (
        <p className="text-xl text-gray-600">No questions added yet. Add your first question!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((question) => (
            <div key={question._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">{question.questionText}</h3>
              {question.imageUrl && (
                <div className="relative w-full h-40 mb-4">
                  <Image src={question.imageUrl} alt="Question Image" layout="fill" objectFit="contain" className="rounded-md" />
                </div>
              )}
              <p className="text-gray-700 mb-2">
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              <p className="text-gray-600 text-sm">Category: {question.category || 'N/A'}</p>
              <p className="text-gray-600 text-sm">Difficulty: {question.difficulty || 'N/A'}</p>
              <div className="mt-4 flex space-x-3">
                <Link href={`/dashboard/questions/${question._id}/edit`} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(question._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}