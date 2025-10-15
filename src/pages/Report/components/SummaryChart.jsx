import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SummaryChart = ({ logs }) => {
  const barChartData = useMemo(() => {
    const userActivity = logs.reduce((acc, log) => {
        const userName = log.actor_details ? `${log.actor_details.first_name}` : 'Naməlum';
        acc[userName] = (acc[userName] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(userActivity).map(([name, fəaliyyət]) => ({ name, fəaliyyət }));
  }, [logs]);

  return (
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
  );
};

export default SummaryChart;