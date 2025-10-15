import { useState, useEffect, useMemo } from 'react';
import {
  FaPlusCircle,
  FaCheckCircle,
  FaSyncAlt,
  FaStar,
  FaFilter,
  FaUsers,
  FaDownload
} from 'react-icons/fa';
import { format, startOfDay, endOfDay } from 'date-fns';
import { az } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';
import reportsAPI from '../api/reportsAPI';

const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
  
  const eventVisuals = {
    TASK_CREATED: { Icon: FaPlusCircle, color: 'text-green-500', label: 'Tapşırıq yaradıldı' },
    TASK_APPROVED: { Icon: FaCheckCircle, color: 'text-blue-500', label: 'Tapşırıq təsdiqləndi' },
    TASK_STATUS_CHANGED: { Icon: FaSyncAlt, color: 'text-purple-500', label: 'Status dəyişdirildi' },
    KPI_TASK_EVALUATED: { Icon: FaStar, color: 'text-yellow-500', label: 'Tapşırıq qiymətləndirildi' },
    KPI_USER_EVALUATED: { Icon: FaStar, color: 'text-orange-400', label: 'İstifadəçi qiymətləndirildi' },
    default: { Icon: FaPlusCircle, color: 'text-gray-500', label: 'Digər' },
  };
  
  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return format(date, 'd MMMM yyyy, HH:mm', { locale: az });
    } catch (error) {
      console.error("Invalid date format:", isoString, error);
      return isoString;
    }
  };
  
  const ActivityCard = ({ log }) => {
    const { Icon, color } = eventVisuals[log.action_type] || eventVisuals.default;
    const actorName = log.actor_details ? `${log.actor_details.first_name} ${log.actor_details.last_name}`.trim() : 'Naməlum';
  
    return (
      <div className="flex items-start pb-4 ml-4">
        <div className="flex flex-col items-center mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="w-px h-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <div className="w-full bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 -mt-2">
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
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, users: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    user: 'all',
    actionType: 'all',
    dateRange: [null, null],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [logsResponse, statsResponse, usersResponse] = await Promise.all([
          reportsAPI.getActivityLogs({ page: 1, page_size: 100 }),
          reportsAPI.getDashboardStats(),
          reportsAPI.getAllUsers() 
        ]);
        
        setLogs(logsResponse.data.results || []);
        setStats(statsResponse.data);
        setAllUsers(usersResponse.data || []); 
        
      } catch (err) {
        setError('Məlumatları yükləmək mümkün olmadı. Zəhmət olmasa, səhifəni yeniləyin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);
  
  const filteredLogs = useMemo(() => {
    const [startDate, endDate] = filters.dateRange;
    return logs.filter(log => {
        const logDate = new Date(log.timestamp);
        if (filters.user !== 'all' && log.actor_details?.id !== parseInt(filters.user)) {
            return false;
        }
        if (filters.actionType !== 'all' && log.action_type !== filters.actionType) {
            return false;
        }
        if (startDate && logDate < startOfDay(startDate)) {
            return false;
        }
        if (endDate && logDate > endOfDay(endDate)) {
            return false;
        }
        return true;
    });
  }, [logs, filters]);

  const groupedLogs = useMemo(() => {
    return filteredLogs.reduce((acc, log) => {
      const dateKey = format(new Date(log.timestamp), 'd MMMM yyyy', { locale: az });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(log);
      return acc;
    }, {});
  }, [filteredLogs]);

  const pieChartData = useMemo(() => {
    const statusCounts = filteredLogs.reduce((acc, log) => {
      if (log.action_type === 'TASK_STATUS_CHANGED') {
        const status = log.details?.new_status || 'UNKNOWN';
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {});
    const colors = { 'IN_PROGRESS': '#3B82F6', 'DONE': '#10B981', 'TODO': '#F59E0B' };
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value, fill: colors[name] || '#6B7280' }));
  }, [filteredLogs]);

  const barChartData = useMemo(() => {
      const userActivity = filteredLogs.reduce((acc, log) => {
          const userName = log.actor_details ? `${log.actor_details.first_name}` : 'Naməlum';
          acc[userName] = (acc[userName] || 0) + 1;
          return acc;
      }, {});
      return Object.entries(userActivity).map(([name, fəaliyyət]) => ({ name, fəaliyyət }));
  }, [filteredLogs]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleExport = () => {
    const dataToExport = filteredLogs.map(log => ({
        'İstifadəçi': `${log.actor_details.first_name} ${log.actor_details.last_name}`,
        'Fəaliyyət': log.description,
        'Növ': eventVisuals[log.action_type]?.label || 'Digər',
        'Tarix': formatTimestamp(log.timestamp)
    }));

    const csv = Papa.unparse(dataToExport, { delimiter: ';' });
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'fealiyyet_tarixcesi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) {
    return <div className="text-center p-10 dark:text-white">Yüklənir...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="px-1 text-2xl font-bold mb-6 text-black dark:text-white">
        Hesabatlar və Fəaliyyət Tarixçəsi
      </h2>
      <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-medium mb-4 dark:text-white flex items-center"><FaFilter className="mr-2"/> Filterlər</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarix Aralığı</label>
            <DatePicker
              selectsRange={true}
              startDate={filters.dateRange[0]}
              endDate={filters.dateRange[1]}
              onChange={(update) => handleFilterChange('dateRange', update)}
              isClearable={true}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 min-w-[220px]"
              dateFormat="dd/MM/yyyy"
              locale={az}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">İstifadəçi</label>
            <select 
              value={filters.user} 
              onChange={e => handleFilterChange('user', e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Bütün İstifadəçilər</option>
              {allUsers.map(user => (
                <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fəaliyyət Növü</label>
            <select 
              value={filters.actionType} 
              onChange={e => handleFilterChange('actionType', e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Bütün Növlər</option>
              {Object.entries(eventVisuals).map(([key, {label}]) => (
                key !== 'default' && <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-transparent mb-1">.</label>
            <button 
              onClick={handleExport}
              className="w-full flex items-center justify-center p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaDownload className="mr-2" /> CSV Yüklə
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FaCheckCircle size={24} className="text-white"/>} title="Bu Ay Tamamlanan Tapşırıqlar" value={stats.completed} color="bg-green-500" />
        <StatCard icon={<FaSyncAlt size={24} className="text-white"/>} title="İcrada Olan Tapşırıqlar" value={stats.inProgress} color="bg-blue-500" />
        <StatCard icon={<FaUsers size={24} className="text-white"/>} title="Komanda Üzvləri" value={stats.users} color="bg-purple-500" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Tapşırıq Statusları (Dəyişikliklər)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-[#1B232D] p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 dark:text-white">İstifadəçi üzrə Fəaliyyət Sayı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'rgba(100,100,100,0.1)'}}/>
              <Legend />
              <Bar dataKey="fəaliyyət" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <h2 className="px-1 text-xl font-medium mb-4 text-black dark:text-white">
        Ətraflı Fəaliyyət Tarixçəsi
      </h2>
      <div className="relative">
        {Object.keys(groupedLogs).length > 0 ? (
          Object.keys(groupedLogs).map(dateKey => (
            <div key={dateKey} className="relative mb-4">
              <h3 className="font-semibold text-lg dark:text-gray-300 bg-gray-50 dark:bg-[#131920] p-2 rounded-md mb-4 sticky top-0 z-10">{dateKey}</h3>
              <div className="relative pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                {groupedLogs[dateKey].map((log) => (
                   <ActivityCard key={log.id} log={log} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center dark:text-gray-400 p-10">Seçilmiş filtrlərə uyğun heç bir fəaliyyət qeydi tapılmadı.</p>
        )}
      </div>
    </div>
  );
}

export default Report;