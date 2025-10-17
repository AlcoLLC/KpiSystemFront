import { useState, useEffect } from 'react';
import { FaCheckCircle, FaSyncAlt, FaUsers } from 'react-icons/fa';
import reportsAPI from '../../api/reportsAPI';
import { useActivityLogs } from './hooks/useActivityLogs';
import { exportLogsToCSV } from './utils/csvExporter';
import StatCard from './components/StatCard';
import FilterBar from './components/FilterBar';
import ActivityTimeline from './components/ActivityTimeline';
import SummaryChart from './components/SummaryChart';

function Report() {
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, users: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [filters, setFilters] = useState({
    user: 'all',
    actionType: 'all',
    dateRange: [null, null],
  });

  const { logs, loading, loadingMore, error, hasNextPage, setPage } = useActivityLogs(filters);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          reportsAPI.getDashboardStats(),
          reportsAPI.getAllUsers() 
        ]);
        setStats(statsResponse.data);
        setAllUsers(usersResponse.data || []); 
      } catch (err) {
        alert(err);
      }
    };
    fetchInitialData();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleExport = () => {
    exportLogsToCSV(filters);
  };

  return (
    <div>
      <h2 className="px-1 text-2xl font-bold mb-6 text-black dark:text-white">
        Hesabatlar və Fəaliyyət Tarixçəsi
      </h2>
      
      <FilterBar 
        filters={filters}
        allUsers={allUsers}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaCheckCircle size={24} className="text-white"/>} title="Bu Ay Tamamlanan Tapşırıqlar" value={stats.completed} color="bg-green-500" />
        <StatCard icon={<FaSyncAlt size={24} className="text-white"/>} title="İcrada Olan Tapşırıqlar" value={stats.inProgress} color="bg-blue-500" />
        <StatCard icon={<FaUsers size={24} className="text-white"/>} title="Komanda Üzvləri" value={stats.users} color="bg-purple-500" />
      </div>

      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
              <li className="mr-2 report-deactivetab" role="presentation">
                  <button 
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Ətraflı Fəaliyyət Tarixçəsi
                  </button>
              </li>
              <li className="mr-2 report-deactivetab" role="presentation">
                  <button 
                    className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'summary' ? 'border-blue-500 text-blue-600 dark:text-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                    onClick={() => setActiveTab('summary')}
                  >
                    Qrafik Xülasə
                  </button>
              </li>
          </ul>
      </div>

      <div>
        {activeTab === 'summary' && <SummaryChart logs={logs} />}
        {activeTab === 'details' && (
          <ActivityTimeline
            logs={logs}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasNextPage={hasNextPage}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

export default Report;