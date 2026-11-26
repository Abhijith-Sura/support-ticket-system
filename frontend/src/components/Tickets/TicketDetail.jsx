import { Calendar, Edit3, Lock, Trash2, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { CategorySymbol } from '../Common/BrandSymbols';
import { CATEGORY_COLORS } from '../../utils/constants';
import { formatDateTime, isTicketEditableByUser } from '../../utils/helpers';

const TicketDetail = ({ ticket, canEdit = true, onEdit, onDelete }) => {
  const editable = canEdit && isTicketEditableByUser(ticket);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium ${
                CATEGORY_COLORS[ticket.category] || CATEGORY_COLORS.General
              }`}
            >
              <CategorySymbol category={ticket.category} className="h-3.5 w-3.5" />
              {ticket.category}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{ticket.title}</h1>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2">
            {editable ? (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Locked ({ticket.status})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 border-y border-slate-100 py-3">
        <div className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span>
            Submitted by <strong className="text-slate-700">{ticket.createdBy?.name || 'User'}</strong>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Created {formatDateTime(ticket.createdAt)}</span>
        </div>
        {ticket.assignedTo && (
          <div className="inline-flex items-center gap-1.5">
            <span>
              Assigned to <strong className="text-indigo-700">{ticket.assignedTo.name}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Description
        </h3>
        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {ticket.description}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
