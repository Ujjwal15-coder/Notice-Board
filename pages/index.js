import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NoticeCard from '../components/NoticeCard';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Delete modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { showToast } = useToast();

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notices');
      if (!res.ok) throw new Error('Failed to fetch notices');
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      console.error(error);
      showToast('Failed to load notices. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const confirmDelete = (notice) => {
    setNoticeToDelete(notice);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!noticeToDelete) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${noticeToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete notice');
      
      showToast('Notice deleted successfully', 'success');
      // Optimistic update
      setNotices(notices.filter(n => n.id !== noticeToDelete.id));
    } catch (error) {
      console.error(error);
      showToast('Failed to delete notice', 'error');
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setNoticeToDelete(null);
    }
  };

  const filteredNotices = filter === 'All' 
    ? notices 
    : notices.filter(n => n.category === filter);

  return (
    <>
      <Head>
        <title>Notice Board | Stay Updated</title>
      </Head>

      {/* Hero Section */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-900/40 via-slate-900 to-indigo-900/40 border border-slate-700/50 p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Notice Board</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Stay updated with the latest announcements, examination schedules, and campus events. 
            Important updates are pinned to the top.
          </p>
          
          {/* Filters */}
          <div className="inline-flex bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg">
            {['All', 'General', 'Exam', 'Event'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filter === cat 
                    ? 'bg-violet-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          {filter === 'All' ? 'All Notices' : `${filter} Notices`}
          <span className="bg-slate-800 text-slate-400 text-xs py-0.5 px-2 rounded-full border border-slate-700">
            {filteredNotices.length}
          </span>
        </h2>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 h-64 flex flex-col animate-pulse">
              <div className="flex gap-2 mb-4">
                <div className="h-5 w-16 bg-slate-700 rounded-full"></div>
                <div className="h-5 w-20 bg-slate-700 rounded-full ml-auto"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-700 rounded mb-3"></div>
              <div className="h-4 w-full bg-slate-700/50 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-slate-700/50 rounded mb-2"></div>
              <div className="h-4 w-4/6 bg-slate-700/50 rounded"></div>
              <div className="mt-auto pt-4 flex gap-2 border-t border-slate-700/50">
                <div className="h-8 w-full bg-slate-700 rounded"></div>
                <div className="h-8 w-full bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotices.length > 0 ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              onDelete={confirmDelete} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <span className="text-3xl">📭</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No notices found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {filter === 'All' 
              ? "There are no notices to display yet. Be the first to create one!" 
              : `There are no notices in the ${filter} category.`}
          </p>
          <Link
            href="/notices/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Create Notice
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => !isDeleting && setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Notice"
        message={`Are you sure you want to delete "${noticeToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
}
