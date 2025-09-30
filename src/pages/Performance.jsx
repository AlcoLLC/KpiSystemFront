import React from 'react';
import { Card, Statistic, Row, Col, Table, Avatar, Progress, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler);

// 2. Aylıq Performans Qrafiki üçün
const monthlyPerformanceData = {
  labels: ['May', 'İyun', 'İyul', 'Avqust', 'Sentyabr'],
  datasets: [
    {
      label: 'Tamamlanan Tapşırıqlar',
      data: [30, 38, 45, 40, 42],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
    {
      label: 'Yaradılan Tapşırıqlar',
      data: [35, 40, 48, 45, 44],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgb(255, 99, 132)',
      borderWidth: 1,
    },
  ],
};

// 3. KPI Radar Qrafiki üçün
const kpiRadarData = {
  labels: ['Keyfiyyət', 'Sürət', 'Kommunikasiya', 'Komanda İşi', 'Təşəbbüskarlıq', 'Planlama'],
  datasets: [
    {
      label: 'Ortalama Performans Balı',
      data: [85, 90, 78, 92, 80, 88],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
    },
  ],
};

// 4. Komanda Cədvəli üçün
const teamPerformanceData = [
  { key: '1', name: 'Əhməd Məmmədov', avatar: 'https://i.pravatar.cc/150?img=1', completedTasks: 12, avgRating: 4.8, score: 92 },
  { key: '2', name: 'Ayşə Həsənova', avatar: 'https://i.pravatar.cc/150?img=2', completedTasks: 10, avgRating: 4.5, score: 88 },
  { key: '3', name: 'Rəşad Əliyev', avatar: 'https://i.pravatar.cc/150?img=3', completedTasks: 8, avgRating: 4.2, score: 81 },
  { key: '4', name: 'Leyla Qasımova', avatar: 'https://i.pravatar.cc/150?img=4', completedTasks: 12, avgRating: 4.9, score: 95 },
];


function Performance() {
  // Qaranlıq rejim üçün Chart.js stilləri
  const chartOptions = (isDark) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: isDark ? '#e2e8f0' : '#4b5563' } },
      tooltip: { titleFont: { size: 14 }, bodyFont: { size: 12 } }
    },
    scales: {
      x: { ticks: { color: isDark ? '#9ca3af' : '#6b7280' }, grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
      y: { ticks: { color: isDark ? '#9ca3af' : '#6b7280' }, grid: { color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } }
    }
  });
  
  const radarOptions = (isDark) => ({
    ...chartOptions(isDark),
    scales: {
      r: {
        angleLines: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' },
        grid: { color: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' },
        pointLabels: { color: isDark ? '#e2e8f0' : '#4b5563', font: { size: 12 } },
        ticks: { backdropColor: 'transparent', color: isDark ? '#9ca3af' : '#6b7280' }
      }
    }
  });
  
  const tableColumns = [
    { title: 'İşçi', dataIndex: 'name', key: 'name', render: (text, record) => (
      <div className="flex items-center gap-3">
        <Avatar src={record.avatar} />
        <span className="font-medium text-gray-800 dark:text-gray-200">{text}</span>
      </div>
    )},
    { title: 'Tamamlanan Tapşırıq', dataIndex: 'completedTasks', key: 'completedTasks', align: 'center' },
    { title: 'Ortalama Reytinq', dataIndex: 'avgRating', key: 'avgRating', align: 'center', render: (rating) => <Tag color="gold">{rating} ★</Tag> },
    { title: 'Performans Balı', dataIndex: 'score', key: 'score', render: (score) => (
      <Progress percent={score} size="small" strokeColor={score > 85 ? '#52c41a' : score > 70 ? '#1890ff' : '#faad14'} />
    )},
  ];

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Performans Paneli</h2>
      
      <div className="space-y-6">

        {/* QRAFİKLƏR */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Aylıq Tapşırıq Dinamikası" className="shadow-sm bg-white dark:bg-[#1B232D] h-[400px]">
              <Bar options={chartOptions(document.body.classList.contains('dark'))} data={monthlyPerformanceData} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="KPI Qiymətləndirmə Sahələri" className="shadow-sm bg-white dark:bg-[#1B232D] h-[400px]">
              <Radar options={radarOptions(document.body.classList.contains('dark'))} data={kpiRadarData} />
            </Card>
          </Col>
        </Row>
        
        {/* CƏDVƏL */}
        <Row>
            <Col span={24}>
                <Card title="Komanda Performansı" className="shadow-sm bg-white dark:bg-[#1B232D]">
                    <Table columns={tableColumns} dataSource={teamPerformanceData} pagination={{ pageSize: 5 }} />
                </Card>
            </Col>
        </Row>
      </div>
    </div>
  );
}

export default Performance;