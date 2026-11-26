import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import {
  CATEGORY_COLORS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '../../utils/constants';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import TicketCard from '../Tickets/TicketCard';
import { CategorySymbol } from '../Common/BrandSymbols';

const AdminTicketList = ({ tickets, onTicketUpdated }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuickUpdate = async (ticketId, field, value) => {
    setUpdatingId(ticketId);
    try {
      const updated = await adminService.updateTicket(ticketId, { [field]: value });
      toast.success(`Ticket ${field} updated to ${value}`);
      onTicketUpdated?.(updated);
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to update ${field}`));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            linkPrefix="/admin/tickets"
            showUser
          />
        ))}
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ticket
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Requester
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Priority
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <Link
                      to={`/admin/tickets/${ticket._id}`}
                      className="font-semibold text-sm text-slate-900 hover:text-indigo-600 line-clamp-1"
                    >
                      {ticket.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {ticket.description}
                    </p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-800">
                      {ticket.createdBy?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-500">{ticket.createdBy?.email}</p>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[ticket.category] || CATEGORY_COLORS.General
                      }`}
                    >
                      <CategorySymbol category={ticket.category} className="h-3.5 w-3.5" />
                      {ticket.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <select
                      aria-label={`Priority for ${ticket.title}`}
                      value={ticket.priority}
                      disabled={updatingId === ticket._id}
                      onChange={(e) => handleQuickUpdate(ticket._id, 'priority', e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
                    >
                      {TICKET_PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <select
                      aria-label={`Status for ${ticket.title}`}
                      value={ticket.status}
                      disabled={updatingId === ticket._id}
                      onChange={(e) => handleQuickUpdate(ticket._id, 'status', e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
                    >
                      {TICKET_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(ticket.createdAt)}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/admin/tickets/${ticket._id}`}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      Manage
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminTicketList;
