import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NoticeForm from '../../../components/NoticeForm';
import { useToast } from '../../../components/Toast';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  const { showToast } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Notice not found');
          throw new Error('Failed to fetch notice');
        }
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        setError(err.message);
        showToast(err.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id, showToast]);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errorMsg = Object.values(data.details).flat().join(', ');
          throw new Error(errorMsg || 'Validation failed');
        }
        throw new Error(data.error || 'Failed to update notice');
      }

      showToast('Notice updated successfully!', 'success');
      router.push('/');
    } catch (error) {
      showToast(error.message || 'Failed to update notice', 'error');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Notice Not Found</h2>
        <p className="text-slate-400 mb-6">{error || "The notice you're trying to edit doesn't exist or has been deleted."}</p>
        <Link href="/" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Notice | Notice Board</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <nav className="flex text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-200">Edit Notice</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-white mb-2">Edit Notice</h1>
          <p className="text-slate-400">Update the details of this announcement.</p>
        </div>

        <NoticeForm 
          isEditing={true} 
          initialData={initialData}
          onSubmit={handleSubmit} 
        />
      </div>
    </>
  );
}
