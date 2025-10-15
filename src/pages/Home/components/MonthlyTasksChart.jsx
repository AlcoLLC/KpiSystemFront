import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Spin, message } from 'antd';
import tasksApi from '../../../api/tasksApi';
import dayjs from 'dayjs'; 

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
        const apiData = response.data; 
        const statsMap = new Map(apiData.map((item) => [item.month, item.count]));

        const labels = [];
        const data = [];
        const now = dayjs();

        for (let i = 5; i >= 0; i--) {
          const monthDate = now.subtract(i, 'month');
          const monthKey = monthDate.format('YYYY-MM');
          const rawMonthLabel = monthDate.format('MMMM YYYY');
          const monthLabel = rawMonthLabel.charAt(0).toUpperCase() + rawMonthLabel.slice(1); 
          labels.push(monthLabel);
          data.push(statsMap.get(monthKey) || 0);
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Tamamlanan tapşırıqlar',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        message.error('Aylıq statistikanı yükləmək mümkün olmadı.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[300px]">
        <Spin />
      </div>
    );
  }

  return <Bar options={barOptions} data={chartData} />;
};

export default React.memo(MonthlyTasksChart);
