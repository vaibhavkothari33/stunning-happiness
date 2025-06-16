// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from './components/AuthProvider';
// import AuthProvider from '@/components/AuthProvider'; // Create this component
import Link from 'next/link';
// import AuthStatus from '@/components/AuthStatus'; // Create this component

import AuthStatus from './components/AuthStatus';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Quiz App',
  description: 'Learn and have fun with quizzes!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="bg-blue-600 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                QuizApp
              </Link>
              <div className="flex space-x-4 items-center">
                <Link href="/quiz" className="hover:underline">
                  Play Quiz
                </Link>
                <Link href="/leaderboard" className="hover:underline">
                  Leaderboard
                </Link>
                <AuthStatus />
              </div>
            </nav>
          </header>
          <main className="container mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}