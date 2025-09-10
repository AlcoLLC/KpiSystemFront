import React from 'react';
import { useSelector } from 'react-redux';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag, Space, Table } from 'antd';

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
// Table columns
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Project Name', dataIndex: 'project', key: 'project' },
  { title: 'Company', dataIndex: 'company', key: 'company' },
  { title: 'Start Date', dataIndex: 'start', key: 'start' },
  { title: 'End Date', dataIndex: 'end', key: 'end' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = '';
      if (status === 'In Progress') color = 'orange';
      else if (status === 'Pending') color = 'green';
      else if (status === 'Completed') color = 'blue';
      else if (status === 'Not Started') color = 'red';
      return <Tag color={color}>{status}</Tag>;
    }
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <EyeOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
        <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} />
      </Space>
    )
  }
];

// Table data
const data = [
  {
    id: '#951',
    project: 'Hotel management system',
    company: 'Vaxo Corporation',
    start: '15 Nov, 2025',
    end: '15 Dec, 2025',
    status: 'In Progress'
  },
  {
    id: '#547',
    project: 'Product development',
    company: 'Beja Ltd',
    start: '14 Nov, 2025',
    end: '14 Dec, 2025',
    status: 'Pending'
  },
  {
    id: '#658',
    project: 'Python upgrade',
    company: 'Aegis Industries',
    start: '13 Nov, 2025',
    end: '13 Dec, 2025',
    status: 'Completed'
  },
  {
    id: '#367',
    project: 'Project monitoring',
    company: 'Affort Solutions',
    start: '12 Nov, 2025',
    end: '12 Dec, 2025',
    status: 'Not Started'
  }
];

// ================== Home Component ==================
function Home() {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      className={`p-6 rounded-lg shadow-md transition duration-500 ${
        isDark ? 'bg-[#1B232D] text-white' : 'bg-white text-black'
      }`}
    >
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div
          className={`p-4 rounded-lg shadow transition duration-500 ${
            isDark ? 'bg-[#131920]' : ''
          } w-full max-w-[100%] h-[400px] mx-auto flex items-center justify-center`}
        >
          <Bar options={barOptions} data={barData} />
        </div>

        {/* Doughnut Chart */}
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
        className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? 'bg-[#131920]' : ''}`}
      >
        <h3 className="text-lg font-semibold mb-4">Tasklar</h3>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          className={isDark ? 'dark-table' : 'light-table'}
          rowClassName={() =>
            isDark
              ? 'bg-[#1B232D] text-white hover:bg-[#2A3440]'
              : 'bg-white text-black hover:bg-gray-100'
          }
        />
      </div>
    </div>
  );
}

export default Home;
