import React, { useState, useEffect } from 'react';
import { Form, Modal, Space, Tag, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ReusableTable from '../components/ReusableTable';
import BaseModal from '../components/BaseModal';
import Details from '../components/Details';
import AppForm from '../components/AppForm';
import tasksApi from '../api/tasksApi';
import accountsApi from '../api/accountsApi';

// ================== Form Config ==================
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
    options: [], // Bu dinamik olaraq doldurulacaq
    span: 12
  },

  { name: 'start_date', label: 'Başlama tarixi', type: 'datepicker', span: 8 },
  { name: 'due_date', label: 'Bitmə tarixi', type: 'datepicker', span: 8 }
];

// ================== Task Component ==================
function Task() {
  console.log('Task component rendered'); // Debug üçün
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();

  // Taskları yüklə
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getTasks();
      console.log('Tasks response:', response.data); // Debug üçün
      setData(response.data.results || response.data);
    } catch (error) {
      message.error('Tapşırıqları yükləyərkən xəta baş verdi');
      console.error('Fetch tasks error:', error);
      setData([]); // Error halında boş array
    } finally {
      setLoading(false);
    }
  };

  // İstifadəçiləri yüklə (assignee dropdown üçün)
  const fetchUsers = async () => {
    try {
      const response = await accountsApi.getUsers();
      console.log('Users response:', response.data); // Debug üçün
      const userOptions = response.data.map(user => ({
        value: user.id,
        label: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.username
      }));
      setUsers(userOptions);
      
      // Form field-ə options əlavə et
      const assigneeField = taskFormFields.find(field => field.name === 'assignee');
      if (assigneeField) {
        assigneeField.options = userOptions;
      }
    } catch (error) {
      message.error('İstifadəçiləri yükləyərkən xəta baş verdi');
      console.error('Fetch users error:', error);
      setUsers([]); // Error halında boş array
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

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
      start_date: record.start_date ? dayjs(record.start_date) : null,
      due_date: record.due_date ? dayjs(record.due_date) : null
    });
    setIsAddEditOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Silinməni təsdiqləyin',
      content: `'${record.title}' adlı tapşırığı silmək istədiyinizə əminsiniz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        try {
          await tasksApi.deleteTask(record.id);
          message.success('Tapşırıq uğurla silindi');
          fetchTasks(); // Siyahını yenilə
        } catch (error) {
          message.error('Tapşırığı silərkən xəta baş verdi');
          console.error('Delete task error:', error);
        }
      }
    });
  };

  const handleRowClick = (record) => {
    setCurrentRecord(record);
    setIsViewOpen(true);
  };

  const handleAddEditCancel = () => setIsAddEditOpen(false);
  const handleViewClose = () => setIsViewOpen(false);

  const handleFormFinish = async (values) => {
    try {
      console.log('Form values before submit:', values); // Debug üçün
      
      const payload = {
        ...values,
        start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
        due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null
      };

      console.log('Payload to send:', payload); // Debug üçün

      if (mode === 'add') {
        await tasksApi.createTask(payload);
        message.success('Tapşırıq uğurla yaradıldı');
      } else {
        await tasksApi.updateTask(currentRecord.id, payload);
        message.success('Tapşırıq uğurla yeniləndi');
      }

      setIsAddEditOpen(false);
      fetchTasks(); // Siyahını yenilə
    } catch (error) {
      console.error('Form submit error:', error); // Debug üçün
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Xəta baş verdi';
      message.error(errorMessage);
    }
  };

  const generateDetailsItems = (record) => {
    if (!record) return [];
    
    const getUserName = (userId) => {
      const user = users.find(u => u.value === userId);
      return user ? user.label : `User ${userId}`;
    };

    const getPriorityLabel = (priority) => {
      const priorityMap = {
        'CRITICAL': 'Kritik',
        'HIGH': 'Yüksək',
        'MEDIUM': 'Orta',
        'LOW': 'Aşağı'
      };
      return priorityMap[priority] || priority;
    };

    const getStatusLabel = (status) => {
      const statusMap = {
        'PENDING': 'Gözləyir',
        'TODO': 'To Do',
        'IN_PROGRESS': 'Davam edir',
        'DONE': 'Tamamlandı'
      };
      return statusMap[status] || status;
    };

    return [
      { key: 'id', label: 'ID', value: record.id },
      { key: 'title', label: 'Başlıq', value: record.title },
      { key: 'description', label: 'Təsvir', value: record.description || '-' },
      { 
        key: 'assignee', 
        label: 'İcraçı', 
        value: record.assignee_details || getUserName(record.assignee) || '-' 
      },
      { 
        key: 'created_by', 
        label: 'Yaradan', 
        value: record.created_by_details || '-' 
      },
      { key: 'priority', label: 'Prioritet', value: getPriorityLabel(record.priority) },
      { key: 'status', label: 'Status', value: getStatusLabel(record.status) },
      { key: 'start_date', label: 'Başlama tarixi', value: record.start_date || '-' },
      { key: 'due_date', label: 'Bitmə tarixi', value: record.due_date || '-' },
      { key: 'approved', label: 'Təsdiqləndi', value: record.approved ? 'Bəli' : 'Xeyr' },
      { 
        key: 'created_at', 
        label: 'Yaradılma tarixi', 
        value: record.created_at ? dayjs(record.created_at).format('DD.MM.YYYY HH:mm') : '-' 
      }
    ];
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Başlıq', dataIndex: 'title', key: 'title' },
    { 
      title: 'İcraçı', 
      dataIndex: 'assignee_details', 
      key: 'assignee_details',
      render: (text, record) => text || `User ${record.assignee}`
    },
    { title: 'Başlama tarixi', dataIndex: 'start_date', key: 'start_date' },
    { title: 'Bitmə tarixi', dataIndex: 'due_date', key: 'due_date' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          PENDING: { color: 'orange', label: 'Gözləyir' },
          TODO: { color: 'blue', label: 'To Do' },
          IN_PROGRESS: { color: 'processing', label: 'Davam edir' },
          DONE: { color: 'success', label: 'Tamamlandı' }
        };
        const { color, label } = statusMap[status] || { color: 'default', label: status };
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Prioritet',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const priorityMap = {
          CRITICAL: { color: 'red', label: 'Kritik' },
          HIGH: { color: 'orange', label: 'Yüksək' },
          MEDIUM: { color: 'blue', label: 'Orta' },
          LOW: { color: 'green', label: 'Aşağı' }
        };
        const { color, label } = priorityMap[priority] || { color: 'default', label: priority };
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Təsdiqləndi',
      dataIndex: 'approved',
      key: 'approved',
      render: (approved) => (
        <Tag color={approved ? 'success' : 'warning'}>
          {approved ? 'Bəli' : 'Xeyr'}
        </Tag>
      )
    },
    {
      title: 'Əməliyyatlar',
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
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Tapşırıqlar</h2>
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        <button
          onClick={handleAddClick}
          className="p-2 mb-6 transition-colors duration-300 border rounded text-blue-500 border-blue-500 hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-700"
        >
          + Yeni tapşırıq
        </button>
        
        <Spin spinning={loading}>
          <ReusableTable
            columns={columns}
            dataSource={Array.isArray(data) ? data : []}
            onRowClick={handleRowClick}
            pagination={{ pageSize: 10 }}
            rowKey="id"
          />
        </Spin>
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
        confirmLoading={loading}
      >
        <AppForm form={form} fields={taskFormFields} onFinish={handleFormFinish} />
      </BaseModal>
    </div>
  );
}

export default Task;