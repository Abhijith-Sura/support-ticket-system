import { useCallback, useEffect, useState } from 'react';
import { ticketService } from '../services/ticketService';
import { adminService } from '../services/adminService';
import { getErrorMessage } from '../utils/helpers';

export const useTickets = ({ isAdmin = false, initialParams = {} } = {}) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialParams,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async (overrideParams) => {
    setLoading(true);
    setError('');
    try {
      const queryParams = overrideParams || params;
      const service = isAdmin ? adminService.getAllTickets : ticketService.getTickets;
      const res = await service(queryParams);
      setTickets(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch tickets'));
    } finally {
      setLoading(false);
    }
  }, [isAdmin, params]);

  useEffect(() => {
    let active = true;
    const service = isAdmin ? adminService.getAllTickets : ticketService.getTickets;

    service(params)
      .then((res) => {
        if (!active) return;
        setTickets(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, pages: 1 });
        setError('');
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to fetch tickets'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAdmin, params]);

  const updateParams = useCallback((updates) => {
    setLoading(true);
    setParams((prev) => ({
      ...prev,
      ...updates,
      page: updates.page !== undefined ? updates.page : 1,
    }));
  }, []);

  const resetParams = useCallback(() => {
    setLoading(true);
    setParams({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', ...initialParams });
  }, [initialParams]);

  return {
    tickets,
    pagination,
    params,
    loading,
    error,
    updateParams,
    resetParams,
    refetch: fetchTickets,
  };
};
