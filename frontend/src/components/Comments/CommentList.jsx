import { Shield } from 'lucide-react';
import { formatDateTime, getInitials } from '../../utils/helpers';

const CommentList = ({ comments = [] }) => {
  if (comments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
        No comments yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isStaff = comment.userId?.role === 'admin';
        return (
          <div
            key={comment._id}
            className={`rounded-2xl border p-4 ${
              isStaff
                ? 'border-indigo-200 bg-indigo-50/40'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isStaff
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {getInitials(comment.userId?.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {comment.userId?.name || 'User'}
                    </span>
                    {isStaff && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                        <Shield className="h-2.5 w-2.5" />
                        Support Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{comment.userId?.email}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {formatDateTime(comment.createdAt)}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {comment.text}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
