import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'antd';

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

// Chart data
const barLabels = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul'];

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'Bar Chart Example' }
  }
};

const barData = {
  labels: barLabels,
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

// Table data
const dataSource = [
  { key: '1', name: 'Mike', age: 32, address: '10 Downing Street' },
  { key: '2', name: 'John', age: 42, address: '10 Downing Street' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

function Home() {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div className={`p-6 rounded-lg shadow-md transition duration-500 ${isDark ? "bg-[#1B232D] text-white" : "bg-white text-black"}`}>
      <h2 className="text-xl font-bold mb-6">Dashboard Charts</h2>

      {/* Charts */}
      <div className="w-full grid grid-cols-2 gap-6 mb-6">
        <div className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? "bg-[#131920]" : "bg-[#f9fafb]"}`}>
          <Bar options={barOptions} data={barData} />
        </div>

        <div className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? "bg-[#131920]" : "bg-[#f9fafb]"}`}>
          <Doughnut data={doughnutData} />
        </div>
      </div>

      {/* Table */}
      <div className={`p-4 rounded-lg shadow transition duration-500 ${isDark ? "bg-[#131920]" : "bg-[#f9fafb]"}`}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    </div>
  );
}

export default Home;
