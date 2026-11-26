import { useState } from 'react';
import { Send } from 'lucide-react';

const CommentForm = ({ onSubmit, submitting = false }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter a comment before posting.');
      return;
    }
    setError('');
    const success = await onSubmit(trimmed);
    if (success !== false) {
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="comment-text" className="block text-sm font-medium text-slate-700 mb-1.5">
          Add a Comment
        </label>
        <textarea
          id="comment-text"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a reply or update..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          <Send className="h-4 w-4" />
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
