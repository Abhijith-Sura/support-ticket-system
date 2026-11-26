import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import AppLayout from '../components/Layout/AppLayout';
import TicketFilters from '../components/Tickets/TicketFilters';
import TicketList from '../components/Tickets/TicketList';
import Pagination from '../components/Common/Pagination';
import Loading from '../components/Common/Loading';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import { useTickets } from '../hooks/useTickets';

const TicketsPage = () => {
  const {
    tickets,
    pagination,
    params,
    loading,
    error,
    updateParams,
    resetParams,
    refetch,
  } = useTickets();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Support Tickets</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track progress, search, filter, and manage your submitted tickets
            </p>
          </div>
          <Link
            to="/tickets/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Ticket
          </Link>
        </div>

        <TicketFilters params={params} onChange={updateParams} onReset={resetParams} />

        {loading ? (
          <Loading text="Fetching tickets..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : tickets.length === 0 ? (
          <EmptyState
            title="No matching tickets"
            description="Try adjusting your search query or filters, or submit a new support ticket."
            action={
              <Link
                to="/tickets/new"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <PlusCircle className="h-4 w-4" />
                Create Ticket
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            <TicketList tickets={tickets} />
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

export default TicketsPage;
