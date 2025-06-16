// app/leaderboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
interface LeaderboardEntry {
  userId: string;
  userName: string;
  userImage?: string;
  quizId: string;
  quizTitle: string;
  score: number;
  finishedAt: string;
}

// Ensure your WebSocket server URL matches where your custom server is running
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
  transports: ['websocket'], // Prefer WebSocket
});


export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/quiz/leaderboard');
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to fetch leaderboard');
        return;
      }
      setLeaderboard(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('An unexpected error occurred while fetching leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    // Socket.IO listener for live updates
    socket.on('leaderboard_update', (data: LeaderboardEntry) => {
      // Re-fetch the entire leaderboard for simplicity, or update client-side state
      fetchLeaderboard();
      console.log('Leaderboard updated:', data);
    });

    return () => {
      socket.off('leaderboard_update');
    };
  }, []);

  if (loading) {
    return <div className="text-center mt-8 text-xl">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-8">Live Leaderboard</h1>
      {leaderboard.length === 0 ? (
        <p className="text-xl text-gray-600">No scores yet. Be the first to complete a quiz!</p>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finished At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr key={entry.userId + entry.quizId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      {entry.userImage && (
                        <Image
                          src={entry.userImage}
                          alt={entry.userName || 'User'}
                          width={32}
                          height={32}
                          className="rounded-full mr-3"
                        />
                      )}
                      {entry.userName || 'Anonymous'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.quizTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{entry.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entry.finishedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}