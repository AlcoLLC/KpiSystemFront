import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Spin, message } from 'antd';
import tasksApi from '../../../api/tasksApi';

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Son 6 Ayda Tamamlanan Tapşırıqlar' }
  }
};

const MonthlyTasksChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tasksApi.getMonthlyStats();
        setChartData({
          labels: response.data.labels,
          datasets: [{
            label: 'Tamamlanan tapşırıqlar',
            data: response.data.data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          }]
        });
      } catch (error) {
        message.error('Aylıq statistikanı yükləmək mümkün olmadı.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spin /></div>;
  }

  return <Bar options={barOptions} data={chartData} />;
};

export default React.memo(MonthlyTasksChart);