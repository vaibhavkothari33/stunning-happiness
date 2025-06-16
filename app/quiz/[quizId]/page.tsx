// app/quiz/[quizId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
// import { IQuestion } from '@/models/Questions';
interface CurrentQuestionPayload {
  _id: string;
  questionText: string;
  imageUrl?: string;
}

export default function ActiveQuizPage({ params }: { params: { quizId: string } }) {
  const { quizId: attemptId } = params;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestionPayload | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchCurrentQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/quiz', {
          method: 'POST', // Re-use the /api/quiz POST to get current state
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId }), // Pass attempt ID to ensure correct resume
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to load quiz');
          // Optionally redirect if quiz is truly not found or unauthorized
          if (res.status === 404 || res.status === 401) {
             router.replace('/quiz'); // Go back to quiz entry
          }
          return;
        }

        if (data.isCompleted) {
          setIsQuizCompleted(true);
          setScore(data.score);
          setMessage(data.message);
          return;
        }

        setCurrentQuestion(data.currentQuestion);
        setScore(data.score);
        setCurrentQuestionNumber(data.currentQuestionNumber);
        setTotalQuestions(data.totalQuestions);
      } catch (err) {
        console.error('Error fetching quiz state:', err);
        setError('An unexpected error occurred while loading quiz.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentQuestion();
  }, [attemptId, session, status, router]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion || !submittedAnswer.trim()) {
      setMessage('Please type an answer.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('Submitting answer...');

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, submittedAnswer }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to submit answer');
        return;
      }

      setScore(data.score);
      setMessage(data.message);
      setSubmittedAnswer(''); // Clear input

      if (data.isQuizCompleted) {
        setIsQuizCompleted(true);
      } else if (data.isCorrect && data.nextQuestion) {
        // If correct and there's a next question, update to the next question
        setCurrentQuestion(data.nextQuestion);
        setCurrentQuestionNumber(data.currentQuestionNumber);
        setTotalQuestions(data.totalQuestions);
      } else {
        // If incorrect, stay on the same question, message will indicate this
        // currentQuestion remains the same
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('An unexpected error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentQuestion && !isQuizCompleted) {
    return <div className="text-center mt-8 text-xl">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error: {error}</div>;
  }

  if (isQuizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h2 className="text-4xl font-bold text-green-600 mb-6">Quiz Completed!</h2>
        <p className="text-xl mb-4">Your final score: {score} / {totalQuestions}</p>
        <p className="text-lg text-gray-700">{message}</p>
        <button
          onClick={() => router.push('/leaderboard')}
          className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
        >
          View Leaderboard
        </button>
        <button
          onClick={() => router.push('/quiz')}
          className="mt-4 bg-gray-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-600 transition-colors"
        >
          Play Another Quiz
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="text-center mt-8 text-xl">No question loaded.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h2 className="text-3xl font-semibold mb-4">
        Question {currentQuestionNumber} of {totalQuestions}
      </h2>
      <p className="text-xl mb-6">{currentQuestion.questionText}</p>

      {currentQuestion.imageUrl && (
        <div className="relative w-full max-w-lg h-64 mb-6">
          <Image
            src={currentQuestion.imageUrl}
            alt="Question Image"
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-md"
          />
        </div>
      )}

      <form onSubmit={handleSubmitAnswer} className="w-full max-w-md">
        <input
          type="text"
          value={submittedAnswer}
          onChange={(e) => setSubmittedAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </button>
      </form>

      {message && <p className={`mt-4 text-center text-lg ${message.includes('Incorrect') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      <p className="mt-2 text-xl font-medium">Current Score: {score}</p>
    </div>
  );
}