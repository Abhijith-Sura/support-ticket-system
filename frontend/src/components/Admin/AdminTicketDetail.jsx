import { useState } from 'react';
import { Save } from 'lucide-react';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../../utils/constants';
import TicketDetail from '../Tickets/TicketDetail';

const AdminTicketDetail = ({ ticket, admins = [], onUpdate, updating = false }) => {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo?._id || '');

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate({
      status,
      priority,
      assignedTo: assignedTo || null,
    });
  };

  return (
    <div className="space-y-6">
      <TicketDetail ticket={ticket} canEdit={false} />

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 shadow-sm space-y-4"
      >
        <div>
          <h2 className="text-base font-semibold text-slate-900">Admin Triage Controls</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Updating status triggers automatic activity log events and user notifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <select
              id="admin-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-priority" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              id="admin-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {TICKET_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-assignee" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Assigned Agent
            </label>
            <select
              id="admin-assignee"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Unassigned</option>
              {admins.map((a) => (
                <option key={a._id || a.id} value={a._id || a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            <Save className="h-4 w-4" />
            {updating ? 'Saving...' : 'Update Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminTicketDetail;
