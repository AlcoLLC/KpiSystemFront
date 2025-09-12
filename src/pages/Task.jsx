import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Modal, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ReusableTable from '../components/ReusableTable';
import BaseModal from '../components/BaseModal';
import Details from '../components/Details';
import AppForm from '../components/AppForm';

// ================== Form Config ==================
// Task.jsx faylında

const taskFormFields = [
  {
    name: 'title',
    label: 'Başlıq',
    type: 'text',
    rules: [{ required: true, message: 'Başlıq daxil edin!' }],
    span: 24
  },
  { name: 'description', label: 'Təsvir', type: 'textarea', span: 24 }, 

  {
    name: 'priority',
    label: 'Prioritet',
    type: 'select',
    rules: [{ required: true }],
    options: [
      { value: 'CRITICAL', label: 'Kritik' },
      { value: 'HIGH', label: 'Yüksək' },
      { value: 'MEDIUM', label: 'Orta' },
      { value: 'LOW', label: 'Aşağı' }
    ],
    span: 12
  }, 

  {
    name: 'assignee',
    label: 'İcraçı',
    type: 'select',
    rules: [{ required: true }],
    options: [
      { value: 'User 1', label: 'User 1' },
      { value: 'User 2', label: 'User 2' }
    ],
    span: 12
  }, // Yarım en

  { name: 'start_date', label: 'Başlama tarixi', type: 'datepicker', span: 8 }, 
  { name: 'due_date', label: 'Bitmə tarixi', type: 'datepicker', span: 8 }, 
  { name: 'estimated_hours', label: 'Planlanan saat', type: 'number', span: 8 }, 

  {
    name: 'status',
    label: 'Status',
    type: 'select',
    initialValue: 'TODO',
    options: [
      { value: 'TODO', label: 'To Do' },
      { value: 'IN_PROGRESS', label: 'In Progress' },
      { value: 'DONE', label: 'Done' }
    ],
    span: 24
  } // Tam en
];
// ================== Initial Data ==================
const initialData = [
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
  }
];

// ================== Task Component ==================
function Task() {
  const isDark = useSelector((state) => state.theme.isDark);
  const [data, setData] = useState(initialData);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  const handleAddClick = () => {
    setMode('add');
    setCurrentRecord(null);
    form.resetFields();
    setIsAddEditOpen(true);
  };

  const handleEdit = (record) => {
    setMode('edit');
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date, 'DD MMM, YYYY') : null,
      due_date: record.due_date ? dayjs(record.due_date, 'DD MMM, YYYY') : null
    });
    setIsAddEditOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Silməyi təsdiqləyin',
      content: `'${record.title}' başlıqlı tapşırığı silmək istədiyinizə əminsiniz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: () => setData((prev) => prev.filter((item) => item.id !== record.id))
    });
  };

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  const handleAddEditCancel = () => setIsAddEditOpen(false);
  const handleViewClose = () => setIsViewOpen(false);

  const handleFormFinish = (values) => {
    const payload = {
      id: mode === 'add' ? `#${Math.floor(Math.random() * 900 + 100)}` : currentRecord.id,
      ...values,
      start_date: values.start_date ? values.start_date.format('DD MMM, YYYY') : '',
      due_date: values.due_date ? values.due_date.format('DD MMM, YYYY') : ''
    };
    if (mode === 'add') setData((prev) => [...prev, payload]);
    else setData((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
    setIsAddEditOpen(false);
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
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          />
          <DeleteOutlined
            style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '18px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 className={`px-1 text-xl font-medium mb-6 ${isDark ? 'text-white' : 'text-black'}`}>
        Tapşırıqlar
      </h2>
      <div
        className={`p-6 rounded-lg shadow-md transition duration-500 ${
          isDark ? 'bg-[#1B232D]' : 'bg-white'
        }`}
      >
        <button
          onClick={handleAddClick}
          className={`p-2 mb-6 transition duration-300 border rounded ${
            isDark
              ? 'text-white border-white hover:bg-gray-700'
              : 'text-blue-500 border-blue-500 hover:bg-gray-100'
          }`}
        >
          + Yeni tapşırıq
        </button>
        <ReusableTable
          columns={columns}
          dataSource={data}
          onRowClick={handleRowClick}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <BaseModal
        title="Tapşırıq Məlumatları"
        open={isViewOpen}
        onCancel={handleViewClose}
        footer={null}
      >
        <Details items={generateDetailsItems(currentRecord)} />
      </BaseModal>

      <BaseModal
        title={mode === 'add' ? 'Yeni Tapşırıq' : 'Tapşırığı Redaktə et'}
        open={isAddEditOpen}
        onOk={() => form.submit()}
        onCancel={handleAddEditCancel}
      >
        <AppForm form={form} fields={taskFormFields} onFinish={handleFormFinish} />
      </BaseModal>
    </div>
  );
}

export default Task;
