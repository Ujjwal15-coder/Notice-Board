import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NoticeForm({ initialData, onSubmit, isEditing }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Format date to YYYY-MM-DD for date input
  const getInitialDate = () => {
    if (initialData?.publishDate) {
      return new Date(initialData.publishDate).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: getInitialDate(),
    image: initialData?.image || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.body.trim()) newErrors.body = 'Body is required';
    if (!formData.publishDate) newErrors.publishDate = 'Publish date is required';
    
    if (formData.image && !formData.image.startsWith('http') && !formData.image.startsWith('data:image')) {
      newErrors.image = 'Image must be a valid URL or Base64 string';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";
  const errorClasses = "text-red-400 text-xs mt-1 font-medium";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-700/80 backdrop-blur-sm shadow-xl">
      {/* Title */}
      <div>
        <label htmlFor="title" className={labelClasses}>Notice Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Final Semester Examination Schedule"
          className={inputClasses}
          disabled={isSubmitting}
        />
        {errors.title && <p className={errorClasses}>{errors.title}</p>}
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className={labelClasses}>Notice Details *</label>
        <textarea
          id="body"
          name="body"
          rows="5"
          value={formData.body}
          onChange={handleChange}
          placeholder="Enter the full details of the notice..."
          className={`${inputClasses} resize-y min-h-[120px]`}
          disabled={isSubmitting}
        ></textarea>
        {errors.body && <p className={errorClasses}>{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className={labelClasses}>Category *</label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`${inputClasses} appearance-none cursor-pointer`}
              disabled={isSubmitting}
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Publish Date */}
        <div>
          <label htmlFor="publishDate" className={labelClasses}>Publish Date *</label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {errors.publishDate && <p className={errorClasses}>{errors.publishDate}</p>}
        </div>
      </div>

      {/* Priority Toggle */}
      <div>
        <label className={labelClasses}>Priority *</label>
        <div className="flex gap-4">
          <label className={`flex-1 cursor-pointer relative rounded-lg border p-4 flex items-center gap-3 transition-all ${
            formData.priority === 'Normal' 
              ? 'bg-slate-700/80 border-slate-500 shadow-md' 
              : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
          }`}>
            <input
              type="radio"
              name="priority"
              value="Normal"
              checked={formData.priority === 'Normal'}
              onChange={handleChange}
              className="sr-only"
              disabled={isSubmitting}
            />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              formData.priority === 'Normal' ? 'border-violet-500' : 'border-slate-500'
            }`}>
              {formData.priority === 'Normal' && <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />}
            </div>
            <div>
              <span className="block text-sm font-medium text-white">Normal</span>
              <span className="block text-xs text-slate-400">Standard visibility</span>
            </div>
          </label>

          <label className={`flex-1 cursor-pointer relative rounded-lg border p-4 flex items-center gap-3 transition-all ${
            formData.priority === 'Urgent' 
              ? 'bg-red-900/20 border-red-500/50 shadow-md shadow-red-900/20' 
              : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
          }`}>
            <input
              type="radio"
              name="priority"
              value="Urgent"
              checked={formData.priority === 'Urgent'}
              onChange={handleChange}
              className="sr-only"
              disabled={isSubmitting}
            />
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              formData.priority === 'Urgent' ? 'border-red-500' : 'border-slate-500'
            }`}>
              {formData.priority === 'Urgent' && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
            </div>
            <div>
              <span className="block text-sm font-medium text-red-400 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Urgent
              </span>
              <span className="block text-xs text-slate-400">Pinned to top with badge</span>
            </div>
          </label>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className={labelClasses}>
          Image URL <span className="text-slate-500 font-normal">(Optional)</span>
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={inputClasses}
              disabled={isSubmitting}
            />
            {errors.image && <p className={errorClasses}>{errors.image}</p>}
          </div>
        </div>
        {formData.image && !errors.image && (
          <div className="mt-3 relative w-full h-32 rounded-lg overflow-hidden border border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => setErrors(prev => ({...prev, image: 'Image failed to load. Check the URL.'}))}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Publishing...'}
            </>
          ) : (
            <>
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
              <span className="relative">{isEditing ? 'Update Notice' : 'Publish Notice'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
