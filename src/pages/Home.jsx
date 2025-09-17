import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Tag, message } from 'antd';
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
import tasksApi from '../api/tasksApi';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Status və Priority rəng konfiqurasiyaları
const STATUS_COLORS = {
  Gözləmədə: 'orange', Təsdiqlənib: 'green', 'Davam edir': 'processing', Tamamlanıb: 'success'
};

const PRIORITY_COLORS = {
  'Çox vacib': 'red', Yüksək: 'volcano', Orta: 'gold', Aşağı: 'lime'
};

// Chart konfiqurasiyaları
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
  labels: ['Təsdiqlənmiş', 'Davam edən', 'Tamamlanmış'],
  datasets: [
    {
      label: 'Statusa görə bölgü',
      data: [15, 9, 25],
      backgroundColor: ['rgb(255, 205, 86)', 'rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
      hoverOffset: 4
    }
  ]
};

function Home() {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Son 10 tapşırığı yüklə
  const fetchRecentTasks = async () => {
    setLoading(true);
    try {
      const response = await tasksApi.getTasks({ page_size: 10 });
      const responseData = response.data;
      setTasks(responseData.results || responseData || []);
    } catch (error) {
      console.error('Son tapşırıqları yükləmək alınmadı:', error);
      message.error('Son tapşırıqları yükləmək mümkün olmadı.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  // Cədvəl sütunları (Task səhifəsi ilə eyni)
  const columns = [
    { title: '№', key: 'index', width: 60, render: (_, __, index) => index + 1 },
    { title: 'Başlıq', dataIndex: 'title', key: 'title', width: 200 },
    { title: 'İcraçı', dataIndex: 'assignee_details', key: 'assignee_details', width: 120 },
    { 
      title: 'Status', 
      dataIndex: 'status_display', 
      key: 'status', 
      width: 120, 
      render: status => <Tag color={STATUS_COLORS[status] || 'default'}>{status}</Tag> 
    },
    { 
      title: 'Prioritet', 
      dataIndex: 'priority_display', 
      key: 'priority', 
      width: 100, 
      render: priority => <Tag color={PRIORITY_COLORS[priority] || 'default'}>{priority}</Tag> 
    },
    { 
      title: 'Başlama tarixi', 
      dataIndex: 'start_date', 
      key: 'start_date', 
      width: 100, 
      render: date => date ? dayjs(date).format('DD MMM YYYY') : '-' 
    },
    { 
      title: 'Bitmə tarixi', 
      dataIndex: 'due_date', 
      key: 'due_date', 
      width: 100, 
      render: date => date ? dayjs(date).format('DD MMM YYYY') : '-' 
    }
  ];

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setCurrentRecord(null);
  };

  // Təfərrüat məlumatları
  const generateDetailsItems = (record) => !record ? [] : [
    { key: 'title', label: 'Başlıq', value: record.title },
    { key: 'description', label: 'Təsvir', value: record.description || '-' },
    { key: 'assignee', label: 'İcraçı', value: record.assignee_details || '-' },
    { key: 'created_by', label: 'Yaradan', value: record.created_by_details || '-' },
    { key: 'priority', label: 'Prioritet', value: record.priority_display || '-' },
    { key: 'status', label: 'Status', value: record.status_display || '-' },
    { key: 'start_date', label: 'Başlama tarixi', value: dayjs(record.start_date).format('DD MMMM YYYY') || '-' },
    { key: 'due_date', label: 'Bitmə tarixi', value: dayjs(record.due_date).format('DD MMMM YYYY') || '-' },
    { key: 'approved', label: 'Təsdiqləndi', value: record.approved ? 'Bəli' : 'Xeyr' },
    { key: 'created_at', label: 'Yaradılma tarixi', value: record.created_at ? dayjs(record.created_at).format('DD MMMM YYYY HH:mm') : '-' }
  ];

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Ana səhifə</h2>
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920]">
            <Bar options={barOptions} data={barData} />
          </div>
          <div className="p-4 rounded-lg shadow bg-gray-50 dark:bg-[#131920]">
            <div className="max-w-[400px] mx-auto">
              <Doughnut data={doughnutData} />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Son Tapşırıqlar</h3>
          <ReusableTable
            columns={columns}
            dataSource={tasks}
            onRowClick={handleRowClick}
            pagination={false}
            loading={loading}
            rowKey="id"
          />
          <div className="mt-4 flex justify-end">
            <Link
              to="/task"
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black transition-colors duration-500"
            >
              Bütün tapşırıqlar
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <BaseModal
        title="Tapşırıq Məlumatları"
        open={isViewOpen}
        onCancel={handleViewClose}
        footer={null}
      >
        <Details items={generateDetailsItems(currentRecord)} />
      </BaseModal>
    </div>
  );
}

export default Home;