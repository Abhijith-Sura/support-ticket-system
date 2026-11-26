import { RotateCcw } from 'lucide-react';
import SearchBar from '../Common/SearchBar';
import {
  SORT_OPTIONS,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../../utils/constants';

const TicketFilters = ({ params, onChange, onReset, users = [] }) => {
  const currentSort = `${params.sortBy || 'createdAt'}:${params.sortOrder || 'desc'}`;
  const hasFilters = Boolean(
    params.search || params.status || params.priority || params.category || params.userId
  );

  const handleSortChange = (val) => {
    const [sortBy, sortOrder] = val.split(':');
    onChange({ sortBy, sortOrder });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={params.search || ''}
          onChange={(search) => onChange({ search })}
          placeholder="Search by title or description..."
        />

        <select
          value={params.status || ''}
          onChange={(e) => onChange({ status: e.target.value })}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Statuses</option>
          {TICKET_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={params.priority || ''}
          onChange={(e) => onChange({ priority: e.target.value })}
          aria-label="Filter by priority"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Priorities</option>
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <select
          value={params.category || ''}
          onChange={(e) => onChange({ category: e.target.value })}
          aria-label="Filter by category"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Categories</option>
          {TICKET_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {users.length > 0 && (
          <select
            value={params.userId || ''}
            onChange={(e) => onChange({ userId: e.target.value })}
            aria-label="Filter by user"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u._id || u.id} value={u._id || u.id}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort tickets"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketFilters;
