import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Ticket,
  Users,
} from 'lucide-react';
import StatsCard from './StatsCard';
import ActivityTimeline from '../Tickets/ActivityTimeline';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from '../../utils/constants';

const BarRow = ({ label, count, total, barColor }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          <strong className="text-slate-900">{count}</strong> ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const AdminDashboard = ({ stats }) => {
  const total = stats?.totalTickets || 0;
  const byStatus = stats?.byStatus || {};
  const byPriority = stats?.byPriority || {};
  const byCategory = stats?.byCategory || {};
  const recentActivity = stats?.recentActivity || [];

  const statusBarColors = {
    Open: 'bg-blue-500',
    'In Progress': 'bg-amber-500',
    Resolved: 'bg-emerald-500',
    Closed: 'bg-slate-400',
  };

  const priorityBarColors = {
    Low: 'bg-sky-400',
    Medium: 'bg-yellow-500',
    High: 'bg-orange-500',
    Urgent: 'bg-rose-500',
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tickets"
          value={total}
          subtitle={`${byStatus.Open || 0} currently open`}
          icon={Ticket}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatsCard
          title="In Progress"
          value={byStatus['In Progress'] || 0}
          subtitle="Being actively handled"
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Urgent Priority"
          value={byPriority.Urgent || 0}
          subtitle={`${byPriority.High || 0} high priority`}
          icon={AlertTriangle}
          colorClass="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="Resolved & Users"
          value={byStatus.Resolved || 0}
          subtitle={`${stats?.totalUsers || 0} registered users`}
          icon={Users}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Tickets by Status</h2>
            <Link
              to="/admin/tickets"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Manage <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {TICKET_STATUSES.map((status) => (
              <BarRow
                key={status}
                label={status}
                count={byStatus[status] || 0}
                total={total}
                barColor={statusBarColors[status]}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Tickets by Priority</h2>
          <div className="space-y-3">
            {TICKET_PRIORITIES.map((priority) => (
              <BarRow
                key={priority}
                label={priority}
                count={byPriority[priority] || 0}
                total={total}
                barColor={priorityBarColors[priority]}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Tickets by Category</h2>
          <div className="space-y-3">
            {TICKET_CATEGORIES.map((category) => (
              <BarRow
                key={category}
                label={category}
                count={byCategory[category] || 0}
                total={total}
                barColor="bg-indigo-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Event-Driven Activity Log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent System Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live audit trail captured by the event-driven workflow
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Event Stream Active
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto pr-1">
          <ActivityTimeline activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
