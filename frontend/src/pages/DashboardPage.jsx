import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, FolderOpen, PlusCircle, Ticket } from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import StatsCard from '../components/Admin/StatsCard';
import TicketList from '../components/Tickets/TicketList';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { ticketService } from '../services/ticketService';
import { getErrorMessage } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, ticketRes] = await Promise.all([
        ticketService.getStats(),
        ticketService.getTickets({ page: 1, limit: 5 }),
      ]);
      setStats(statsData);
      setRecentTickets(ticketRes.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load dashboard'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([ticketService.getStats(), ticketService.getTickets({ page: 1, limit: 5 })])
      .then(([statsData, ticketRes]) => {
        if (!active) return;
        setStats(statsData);
        setRecentTickets(ticketRes.data || []);
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to load dashboard'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const byStatus = stats?.byStatus || {};

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of your support tickets and recent activity
            </p>
          </div>
          <Link
            to="/tickets/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Support Ticket
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading your dashboard..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadDashboard} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Tickets"
                value={stats?.totalTickets || 0}
                icon={Ticket}
                colorClass="bg-indigo-50 text-indigo-600"
              />
              <StatsCard
                title="Open"
                value={byStatus.Open || 0}
                icon={FolderOpen}
                colorClass="bg-blue-50 text-blue-600"
              />
              <StatsCard
                title="In Progress"
                value={byStatus['In Progress'] || 0}
                icon={Clock}
                colorClass="bg-amber-50 text-amber-600"
              />
              <StatsCard
                title="Resolved"
                value={byStatus.Resolved || 0}
                icon={CheckCircle2}
                colorClass="bg-emerald-50 text-emerald-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Tickets</h2>
                <Link
                  to="/tickets"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {recentTickets.length === 0 ? (
                <EmptyState
                  title="No support tickets yet"
                  description="Have a question or encountered an issue? Create your first ticket and our team will assist you."
                  action={
                    <Link
                      to="/tickets/new"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create First Ticket
                    </Link>
                  }
                />
              ) : (
                <TicketList tickets={recentTickets} />
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
