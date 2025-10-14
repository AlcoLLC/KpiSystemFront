import { useState, useEffect } from 'react';
import { 
  FaPlusCircle, 
  FaCheckCircle, 
  FaSyncAlt, 
  FaStar 
} from 'react-icons/fa';
import reportsAPI from '../api/reportsAPI';

import { format } from 'date-fns';
import { az } from 'date-fns/locale';

const eventVisuals = {
  TASK_CREATED: { Icon: FaPlusCircle, color: 'text-green-500' },
  TASK_APPROVED: { Icon: FaCheckCircle, color: 'text-blue-500' },
  TASK_STATUS_CHANGED: { Icon: FaSyncAlt, color: 'text-purple-500' },
  KPI_TASK_EVALUATED: { Icon: FaStar, color: 'text-yellow-500' },
  KPI_USER_EVALUATED: { Icon: FaStar, color: 'text-orange-400' },
  default: { Icon: FaPlusCircle, color: 'text-gray-500' },
};

const formatTimestamp = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return format(date, 'd MMMM yyyy, HH:mm', { locale: az });
  } catch (error) {
    console.error("Invalid date format:", isoString);
    return isoString; 
  }
};

const ActivityCard = ({ log }) => {
  const { Icon, color } = eventVisuals[log.action_type] || eventVisuals.default;
  const actorName = log.actor_details ? `${log.actor_details.first_name} ${log.actor_details.last_name}`.trim() : 'Naməlum';

  return (
    <div className="flex items-start pb-4">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="w-px h-full bg-gray-300 dark:bg-gray-600 my-2"></div>
      </div>
      <div className="w-full bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-gray-800 dark:text-gray-200">
          <strong className="text-blue-600 dark:text-blue-400">{actorName}</strong>{' '}
          {log.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {formatTimestamp(log.timestamp)}
        </p>
      </div>
    </div>
  );
};

function Report() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true);
        const response = await reportsAPI.getActivityLogs({ page: 1 });
        setLogs(response.data.results || []); 
      } catch (err) {
        setError('Fəaliyyət tarixçəsini yükləmək mümkün olmadı. Zəhmət olmasa, səhifəni yeniləyin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []);

  if (loading) {
    return <div className="text-center p-10 dark:text-white">Yüklənir...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-8 text-black dark:text-white">
        Fəaliyyət Tarixçəsi
      </h2>
      
      <div className="relative">
        <div className="space-y-0">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={log.id} className="relative">
                <ActivityCard log={log} />
                {index === logs.length - 1 && (
                   <div className="absolute left-[19px] top-12 bottom-0 w-px bg-gray-50 dark:bg-[#131920]"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center dark:text-gray-400">Heç bir fəaliyyət qeydi tapılmadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;