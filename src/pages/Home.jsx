import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Table, Modal, Descriptions } from 'antd';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// ================== Chart Configs ==================
const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Bar Chart Example' }
  }
};

const barData = {
  labels: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul'],
  datasets: [
    {
      label: 'Custom Bars',
      data: [10, 20, 30, 40, 50, 60, 70],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      barThickness: 30
    }
  ]
};

const doughnutData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
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
      let color = '';
      if (status === 'IN_PROGRESS' || status === 'In Progress') color = 'orange';
      else if (status === 'TODO' || status === 'Pending') color = 'green';
      else if (status === 'DONE' || status === 'Completed') color = 'blue';
      else color = 'red';

      const labelMap = {
        TODO: 'To Do',
        IN_PROGRESS: 'In Progress',
        DONE: 'Done',
        Pending: 'Pending',
        Completed: 'Completed'
      };
      const label = labelMap[status] || status;
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
  const isDark = useSelector((state) => state.theme.isDark);

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

  return (
    <div>
      <h2 className={`px-1 text-xl font-medium mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        Ana səhifə
      </h2>

      <div
        className={`p-6 rounded-lg shadow-md transition duration-500 ${
          isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div
            className={`p-4 rounded-lg shadow transition duration-500 ${
              isDark ? 'bg-[#131920]' : ''
            } w-full max-w-[100%] h-[400px] mx-auto flex items-center justify-center`}
          >
            <Bar options={barOptions} data={barData} />
          </div>

          <div
            className={`p-4 rounded-lg shadow transition duration-500 ${
              isDark ? 'bg-[#131920]' : ''
            } w-full max-w-[90%] h-[400px] mx-auto flex items-center justify-center`}
          >
            <Doughnut data={doughnutData} />
          </div>
        </div>

        {/* Table Section */}
        <div
          className={`p-4 rounded-lg shadow transition duration-500 ${
            isDark ? 'bg-[#131920]' : ''
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Tasklar</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={ false }
            rowKey="id"
            className={isDark ? 'dark-table' : 'light-table'}
            rowClassName={() =>
              isDark
                ? 'bg-[#1B232D] text-white hover:bg-[#2A3440] cursor-pointer'
                : 'bg-white text-black hover:bg-gray-100 cursor-pointer'
            }
            onRow={(record) => ({
              onClick: () => handleRowClick(record)
            })}
          />
        </div>
      </div>

      {/* View Modal */}
      <Modal
        title={<span className={isDark ? 'text-white' : 'text-black'}>Tapşırıq Məlumatları</span>}
        open={isViewOpen}
        onCancel={handleViewClose}
        width={700}
        footer={null}
        bodyStyle={{ backgroundColor: isDark ? '#1B232D' : '#fff' }}
        closeIcon={
          <span style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold', fontSize: '16px' }}>
            ×
          </span>
        }
      >
        {currentRecord && (
          <Descriptions
            bordered
            column={1}
            size="small"
            labelStyle={{ color: isDark ? '#ffffff' : '#000000', fontWeight: '500' }}
            contentStyle={{ color: isDark ? '#ffffff' : '#000000' }}
          >
            <Descriptions.Item label="ID">{currentRecord.id}</Descriptions.Item>
            <Descriptions.Item label="Başlıq">{currentRecord.title}</Descriptions.Item>
            <Descriptions.Item label="Təsvir">{currentRecord.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="İcraçı">{currentRecord.assignee || '-'}</Descriptions.Item>
            <Descriptions.Item label="Prioritet">{currentRecord.priority || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status">{currentRecord.status || '-'}</Descriptions.Item>
            <Descriptions.Item label="Başlama tarixi">{currentRecord.start_date || '-'}</Descriptions.Item>
            <Descriptions.Item label="Bitmə tarixi">{currentRecord.due_date || '-'}</Descriptions.Item>
            <Descriptions.Item label="Planlanan saat">{currentRecord.estimated_hours || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default Home;
