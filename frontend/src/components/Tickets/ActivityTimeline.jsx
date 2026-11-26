import { Activity, CheckCircle2, MessageSquare, Pencil, PlusCircle, RefreshCw } from 'lucide-react';
import { ACTION_LABELS } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';

const getActionMeta = (action) => {
  switch (action) {
    case 'ticket.created':
      return { icon: PlusCircle, color: 'text-blue-600 bg-blue-50' };
    case 'status.changed':
      return { icon: RefreshCw, color: 'text-amber-600 bg-amber-50' };
    case 'comment.added':
      return { icon: MessageSquare, color: 'text-indigo-600 bg-indigo-50' };
    case 'ticket.resolved':
      return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' };
    case 'ticket.updated':
      return { icon: Pencil, color: 'text-slate-600 bg-slate-100' };
    default:
      return { icon: Activity, color: 'text-slate-600 bg-slate-100' };
  }
};

const formatDetails = (item) => {
  const { action, details } = item;
  if (!details) return '';
  if (action === 'status.changed' && details.from && details.to) {
    return `${details.from} → ${details.to}`;
  }
  if (action === 'ticket.updated' && Array.isArray(details.updatedFields)) {
    return `Updated: ${details.updatedFields.join(', ')}`;
  }
  if (action === 'comment.added' && details.preview) {
    return `"${details.preview}"`;
  }
  if (action === 'ticket.created' && details.priority) {
    return `${details.category || 'General'} • ${details.priority} priority`;
  }
  return '';
};

const ActivityTimeline = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-slate-500 py-4 text-center">No activity recorded yet.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {activities.map((item) => {
        const meta = getActionMeta(item.action);
        const Icon = meta.icon;
        const summary = formatDetails(item);

        return (
          <li key={item._id} className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <p className="text-xs font-semibold text-slate-900">
                  {ACTION_LABELS[item.action] || item.action}
                </p>
                <span className="text-[11px] text-slate-400">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                by <span className="font-medium text-slate-700">{item.userId?.name || 'System'}</span>
                {summary ? ` — ${summary}` : ''}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ActivityTimeline;
