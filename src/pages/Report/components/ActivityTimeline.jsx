import { useMemo, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { az } from 'date-fns/locale';
import { FaSpinner } from 'react-icons/fa';
import ActivityCard from './ActivityCard';

const ActivityTimeline = ({ logs, loading, loadingMore, error, hasNextPage, setPage }) => {
  const observer = useRef();
  const lastLogElementRef = useCallback(node => {
    if (loadingMore || loading) return; 
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        setPage(prevPage => prevPage + 1); 
      }
    });

    if (node) observer.current.observe(node); 
  }, [loadingMore, hasNextPage, loading, setPage]);

  const groupedLogs = useMemo(() => {
    return logs.reduce((acc, log) => {
      const dateKey = format(new Date(log.timestamp), 'd MMMM yyyy', { locale: az });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {});
  }, [logs]);

  if (loading && logs.length === 0) {
    return <div className="text-center p-10 dark:text-white">Yüklənir...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (logs.length === 0) {
    return <p className="text-center dark:text-gray-400 p-10">Seçilmiş filtrlərə uyğun heç bir fəaliyyət qeydi tapılmadı.</p>;
  }

  return (
    <div className="relative">
      {Object.keys(groupedLogs).map(dateKey => (
        <div key={dateKey} className="relative mb-4">
            <h3 className="font-semibold text-lg dark:text-gray-300 bg-gray-50 dark:bg-[#131920] p-2 rounded-md mb-4 sticky top-0 z-10">{dateKey}</h3>
            <div className="relative pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                {groupedLogs[dateKey].map((log, index) => {
                    const isLastLogOnPage = logs.length === (logs.indexOf(log) + 1);
                    return (
                        <div ref={isLastLogOnPage ? lastLogElementRef : null} key={log.id}>
                            <ActivityCard log={log} />
                        </div>
                    );
                })}
            </div>
        </div>
      ))}
      {loadingMore && (
        <div className="flex justify-center items-center p-4">
          <FaSpinner className="animate-spin text-blue-500 h-8 w-8" />
          <span className="ml-2 dark:text-gray-300">Daha çox yüklənir...</span>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;