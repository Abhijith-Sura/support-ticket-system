import { useEffect, useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import TicketFilters from '../components/Tickets/TicketFilters';
import AdminTicketList from '../components/Admin/AdminTicketList';
import Pagination from '../components/Common/Pagination';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import { useTickets } from '../hooks/useTickets';
import { adminService } from '../services/adminService';

const AdminTicketsPage = () => {
  const {
    tickets,
    pagination,
    params,
    loading,
    error,
    updateParams,
    resetParams,
    refetch,
  } = useTickets({ isAdmin: true });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    adminService
      .getUsers()
      .then((list) => setUsers(list || []))
      .catch(() => {});
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Filter by status, priority, category, or user and triage requests across the organization
          </p>
        </div>

        <TicketFilters
          params={params}
          onChange={updateParams}
          onReset={resetParams}
          users={users}
        />

        {loading ? (
          <Loading text="Loading all tickets..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No tickets match your filters"
            description="Adjust or reset your active filters to view all tickets."
          />
        ) : (
          <div className="space-y-4">
            <AdminTicketList tickets={tickets} onTicketUpdated={() => refetch()} />
            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(page) => updateParams({ page })}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminTicketsPage;
