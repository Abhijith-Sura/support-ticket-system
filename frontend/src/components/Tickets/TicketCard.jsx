import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { CategorySymbol } from '../Common/BrandSymbols';
import { CATEGORY_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const TicketCard = ({ ticket, linkPrefix = '/tickets', showUser = false }) => {
  return (
    <Link
      to={`${linkPrefix}/${ticket._id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
              CATEGORY_COLORS[ticket.category] || CATEGORY_COLORS.General
            }`}
          >
            <CategorySymbol category={ticket.category} className="h-3 w-3" />
            {ticket.category}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(ticket.createdAt)}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold text-slate-900 line-clamp-1">
        {ticket.title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{ticket.description}</p>

      {showUser && ticket.createdBy && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <User className="h-3.5 w-3.5" />
          <span>{ticket.createdBy.name}</span>
          <span className="text-slate-300">&bull;</span>
          <span>{ticket.createdBy.email}</span>
        </div>
      )}
    </Link>
  );
};

export default TicketCard;
