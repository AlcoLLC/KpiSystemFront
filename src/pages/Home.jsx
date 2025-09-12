import React, { useState } from 'react';
import { Tag } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ReusableTable from '../components/ReusableTable';
import BaseModal from '../components/BaseModal';
import Details from '../components/Details';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Qeyd: Real layihədə bu konfiqurasiyaları və dataları ayrı fayllara çıxarmaq daha məqsədəuyğundur.
// ================== Chart Configs ==================
const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Aylıq Tapşırıq Statistikası' }
  }
};
const barData = {
  labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul'],
  datasets: [
    {
      label: 'Tamamlanan tapşırıqlar',
      data: [12, 19, 10, 15, 8, 11, 14],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      barThickness: 30
    }
  ]
};
const doughnutData = {
  labels: ['To Do', 'In Progress', 'Done'],
  datasets: [
    {
      label: 'Statusa görə bölgü',
      data: [15, 9, 25],
      backgroundColor: ['rgb(255, 205, 86)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
      hoverOffset: 4
    }
  ]
};

// ================== Table Configs ==================
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Başlıq', dataIndex: 'title', key: 'title' },
  { title: 'Başlama tarixi', dataIndex: 'start_date', key: 'start_date' },
  { title: 'Bitmə tarixi', dataIndex: 'due_date', key: 'due_date' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const statusMap = {
        TODO: { color: 'orange', label: 'To Do' },
        IN_PROGRESS: { color: 'blue', label: 'In Progress' },
        DONE: { color: 'green', label: 'Done' }
      };
      const { color, label } = statusMap[status] || { color: 'red', label: status };
      return <Tag color={color}>{label}</Tag>;
    }
  }
];
const data = [
  {
    id: '#951',
    title: 'Hotel management system',
    start_date: '15 Nov, 2025',
    due_date: '15 Dec, 2025',
    status: 'IN_PROGRESS',
    description: 'Booking & room management.',
    priority: 'HIGH',
    assignee: 'User 1',
    estimated_hours: 120
  },
  {
    id: '#547',
    title: 'Product development',
    start_date: '14 Nov, 2025',
    due_date: '14 Dec, 2025',
    status: 'TODO',
    description: 'New product v2.',
    priority: 'MEDIUM',
    assignee: 'User 2',
    estimated_hours: 80
  },
  {
    id: '#658',
    title: 'Python upgrade',
    start_date: '13 Nov, 2025',
    due_date: '13 Dec, 2025',
    status: 'DONE',
    description: 'Upgrade Python version to 3.12.',
    priority: 'LOW',
    assignee: 'User 3',
    estimated_hours: 40
  }
];

// ================== Home Component ==================
function Home() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };
  const handleViewClose = () => {
    setIsViewOpen(false);
    setCurrentRecord(null);
  };
  const generateDetailsItems = (record) => {
    if (!record) return [];
    return [
      { key: 'id', label: 'ID', value: record.id },
      { key: 'title', label: 'Başlıq', value: record.title },
      { key: 'description', label: 'Təsvir', value: record.description || '-' },
      { key: 'assignee', label: 'İcraçı', value: record.assignee || '-' },
      { key: 'priority', label: 'Prioritet', value: record.priority || '-' },
      { key: 'status', label: 'Status', value: record.status || '-' },
      { key: 'start_date', label: 'Başlama tarixi', value: record.start_date || '-' },
      { key: 'due_date', label: 'Bitmə tarixi', value: record.due_date || '-' },
      { key: 'estimated_hours', label: 'Planlanan saat', value: record.estimated_hours || '-' }
    ];
  };

return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Ana səhifə</h2>
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920]"><Bar options={barOptions} data={barData} /></div>
          <div className="p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920] max-w-[400px] mx-auto"><Doughnut data={doughnutData} /></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Son Tapşırıqlar</h3>
          <ReusableTable columns={columns} dataSource={data} onRowClick={handleRowClick} pagination={false} />
        </div>
      </div>
      <BaseModal title="Tapşırıq Məlumatları" open={isViewOpen} onCancel={handleViewClose} footer={null}>
        <Details items={generateDetailsItems(currentRecord)} />
      </BaseModal>
    </div>
  );
}

export default Home;