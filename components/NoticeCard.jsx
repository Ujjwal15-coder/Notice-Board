import Link from 'next/link';

export default function NoticeCard({ notice, onDelete }) {
  const isUrgent = notice.priority === 'Urgent';

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Exam':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Event':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-900/20 transition-all duration-300 group">
      {/* Optional Image */}
      {notice.image && (
        <div className="w-full h-48 overflow-hidden bg-slate-900 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Badges Row */}
        <div className="flex items-center gap-2 mb-3">
          {isUrgent && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
              Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(
              notice.category
            )}`}
          >
            {notice.category}
          </span>
          <span className="ml-auto text-xs text-slate-400 font-medium">
            {formattedDate}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {notice.title}
        </h3>
        <p className="text-slate-300 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-wrap">
          {notice.body}
        </p>

        {/* Actions Row */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-700/50">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="flex-1 inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(notice)}
            className="flex-1 inline-flex justify-center items-center px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
