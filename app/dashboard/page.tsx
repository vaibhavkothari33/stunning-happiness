// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from '../lib/auth'; 
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/api/auth/signin'); // Or redirect to a 403 forbidden page
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/questions" className="block p-6 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors text-center">
          <h2 className="text-2xl font-semibold mb-2">Manage Questions</h2>
          <p className="text-lg">Add, edit, or delete quiz questions.</p>
        </Link>
        {/* Add more admin sections here, e.g., Manage Quizzes */}
        {/* <Link href="/dashboard/quizzes" className="block p-6 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-center">
          <h2 className="text-2xl font-semibold mb-2">Manage Quizzes</h2>
          <p className="text-lg">Create and configure quiz instances.</p>
        </Link> */}
      </div>
    </div>
  );
}