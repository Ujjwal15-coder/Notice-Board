import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NoticeForm from '../../components/NoticeForm';
import { useToast } from '../../components/Toast';

export default function NewNotice() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          // Format validation errors
          const errorMsg = Object.values(data.details).flat().join(', ');
          throw new Error(errorMsg || 'Validation failed');
        }
        throw new Error(data.error || 'Failed to create notice');
      }

      showToast('Notice created successfully!', 'success');
      router.push('/');
    } catch (error) {
      showToast(error.message || 'Failed to create notice', 'error');
      throw error; // Re-throw so form stays in submitting state if needed, or handle there
    }
  };

  return (
    <>
      <Head>
        <title>Add New Notice | Notice Board</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <nav className="flex text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-slate-200">Add Notice</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-white mb-2">Create New Notice</h1>
          <p className="text-slate-400">Fill out the form below to publish a new announcement.</p>
        </div>

        <NoticeForm 
          isEditing={false} 
          onSubmit={handleSubmit} 
        />
      </div>
    </>
  );
}
