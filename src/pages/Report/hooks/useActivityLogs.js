import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import reportsAPI from '../../../api/reportsAPI';

export const useActivityLogs = (filters) => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(1);
    setLogs([]);
    setHasNextPage(false);
  }, [filters]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const [startDate, endDate] = filters.dateRange;
        const params = { page, page_size: 15 };

        if (filters.user !== 'all') params.actor = filters.user;
        if (filters.actionType !== 'all') params.action_type = filters.actionType;
        if (startDate) params.start_date = format(startDate, 'yyyy-MM-dd');
        if (endDate) params.end_date = format(endDate, 'yyyy-MM-dd');

        const response = await reportsAPI.getActivityLogs(params);
        
        setLogs(prevLogs => 
            page === 1 
            ? response.data.results || [] 
            : [...prevLogs, ...(response.data.results || [])]
        );
        setHasNextPage(response.data.next !== null);

      } catch (err) {
        setError('Fəaliyyət tarixçəsini yükləmək mümkün olmadı. Zəhmət olmasa, şəbəkə bağlantınızı yoxlayın.', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchLogs();
  }, [filters, page]);

  return { logs, loading, loadingMore, error, hasNextPage, setPage };
};