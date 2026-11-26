import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ticket } from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import AdminDashboard from '../components/Admin/AdminDashboard';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import { adminService } from '../services/adminService';
import { getErrorMessage } from '../utils/helpers';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load admin dashboard'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminService
      .getDashboard()
      .then((data) => {
        if (!active) return;
        setStats(data);
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to load admin dashboard'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
            <p className="text-sm text-slate-500 mt-1">
              System-wide ticket metrics, priority distribution, and real-time event audit log
            </p>
          </div>
          <Link
            to="/admin/tickets"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Ticket className="h-4 w-4" />
            Manage All Tickets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading admin analytics..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadStats} />
        ) : (
          <AdminDashboard stats={stats} />
        )}
      </div>
    </AppLayout>
  );
};

export default AdminDashboardPage;
