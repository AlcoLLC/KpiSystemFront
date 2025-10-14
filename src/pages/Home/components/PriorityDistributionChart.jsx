import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Spin, message } from 'antd';
import tasksApi from '../../../api/tasksApi';

const PriorityDistributionChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  const priorityColorMap = {
    'Çox vacib': 'rgba(245, 34, 45, 0.7)',
    'Yüksək': 'rgba(250, 173, 20, 0.7)',
    'Orta': 'rgba(19, 194, 194, 0.7)',
    'Aşağı': 'rgba(82, 196, 26, 0.7)'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await tasksApi.getPriorityStats();
        const backgroundColors = response.data.labels.map(label => priorityColorMap[label] || 'rgba(128, 128, 128, 0.8)');
        
        setChartData({
          labels: response.data.labels,
          datasets: [{
            label: ' Tapşırıqların sayı',
            data: response.data.data,
            backgroundColor: backgroundColors,
            hoverOffset: 4
          }]
        });
      } catch (error) {
        message.error('Prioritet statistikasını yükləmək mümkün olmadı.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spin /></div>;
  }

  return (
    <div className="max-w-[350px] mx-auto">
      <h3 className="text-center text-lg font-medium mb-4 text-black dark:text-white">Tapşırıqların Prioritetə Görə Bölgüsü</h3>
      <Doughnut data={chartData} />
    </div>
  );
};

export default React.memo(PriorityDistributionChart);