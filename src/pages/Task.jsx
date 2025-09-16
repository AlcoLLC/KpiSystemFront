// src/pages/Task.js

import React, { useState, useEffect, useMemo } from 'react';
import { Form, Modal, Space, Tag, message, Button, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addNewTask, updateTask, deleteTask } from '../features/tasks/tasksSlice';
import { EditOutlined, DeleteOutlined, PlusOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import accountsApi from '../api/accountsApi';
import ReusableTable from '../components/ReusableTable';
import BaseModal from '../components/BaseModal';
import Details from '../components/Details';
import AppForm from '../components/AppForm';

const { useModal } = Modal;

// Formun ilkin, şablon konfiqurasiyası
const taskFormFieldsConfig = [
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
    rules: [{ required: true, message: 'Prioritet seçin!' }],
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
    rules: [{ required: true, message: 'İcraçı seçin!' }],
    options: [],
    loading: true,
    span: 12
  },
  { name: 'start_date', label: 'Başlama tarixi', type: 'datepicker', span: 12 },
  { name: 'due_date', label: 'Bitmə tarixi', type: 'datepicker', span: 12 }
];

function Task() {
  // Redux state
  const dispatch = useDispatch();
  const { items: data, status } = useSelector((state) => state.tasks);
  const loading = status === 'loading';

  // Lokal state (UI üçün)
  const [users, setUsers] = useState([]);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = useModal();

  // Səhifə yüklənəndə ilkin məlumatları çəkir
  useEffect(() => {
    dispatch(fetchTasks());

    const fetchUsers = async () => {
      try {
        const response = await accountsApi.getUsers();
        setUsers(response.data.results || response.data || []);
      } catch (err) {
        console.error('İstifadəçiləri yükləmək alınmadı:', err);
        message.error('İcraçı siyahısını yükləmək mümkün olmadı.');
      }
    };
    fetchUsers();
  }, [dispatch]);

  // `users` state-i dəyişdikdə form sahələrini yenidən hesablayır
  const formFields = useMemo(() => {
    const userOptions = users.map((user) => ({
      value: user.id,
      label:
        user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username
    }));

    return taskFormFieldsConfig.map((field) =>
      field.name === 'assignee'
        ? { ...field, options: userOptions, loading: users.length === 0 && loading }
        : // DİQQƏT: Yüklənmə indikatorunu daha doğru idarə etmək üçün 'loading' statusunu
          // API sorğusunun öz statusundan asılı etmək daha yaxşıdır.
          // Məsələn, users üçün ayrı bir 'loading' statusu saxlamaq olar.
          // Hal-hazırda 'tasks' yüklənərkən 'assignee' də loading göstərəcək.
          field
    );
  }, [users, loading]);

  // =================================================================
  // DÜZƏLİŞ: Modal açıldıqdan sonra formu doldurmaq üçün useEffect
  // =================================================================
  useEffect(() => {
    if (isAddEditOpen) {
      if (mode === 'edit' && currentRecord) {
        form.setFieldsValue({
          ...currentRecord,
          start_date: currentRecord.start_date ? dayjs(currentRecord.start_date) : null,
          due_date: currentRecord.due_date ? dayjs(currentRecord.due_date) : null
        });
      } else {
        form.resetFields();
      }
    }
  }, [isAddEditOpen, mode, currentRecord, form]);

  // =================================================================
  // DÜZƏLİŞ: Sadələşdirilmiş handler funksiyaları
  // =================================================================
  const handleAddClick = () => {
    setMode('add');
    setCurrentRecord(null);
    setIsAddEditOpen(true);
  };

  const handleEdit = (record) => {
    setMode('edit');
    setCurrentRecord(record);
    setIsAddEditOpen(true);
  };

  // =================================================================

  const handleDelete = (record) => {
    modal.confirm({
      title: 'Silinməni təsdiqləyin',
      content: `'${record.title}' adlı tapşırığı silmək istədiyinizə əminsiniz?`,
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        try {
          await dispatch(deleteTask(record.id)).unwrap();
          message.success('Tapşırıq uğurla silindi');
        } catch (err) {
          message.error(err.message || 'Tapşırığı silərkən xəta baş verdi');
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
    const payload = {
      ...values,
      start_date: values.start_date ? values.start_date.format('YYYY-MM-DD') : null,
      due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null
    };

    try {
      if (mode === 'add') {
        await dispatch(addNewTask(payload)).unwrap();
        message.success('Tapşırıq uğurla yaradıldı');
      } else {
        await dispatch(updateTask({ id: currentRecord.id, taskData: payload })).unwrap();
        message.success('Tapşırıq uğurla yeniləndi');
      }
      setIsAddEditOpen(false);
    } catch (err) {
      console.error('Form submit error:', err);
      const errorMessage = typeof err === 'string' ? err : 'Əməliyyat uğursuz oldu.';
      message.error(errorMessage);
    }
  };

  const generateDetailsItems = (record) => {
    if (!record) return [];
    return [
      { key: 'id', label: 'ID', value: record.id },
      { key: 'title', label: 'Başlıq', value: record.title },
      { key: 'description', label: 'Təsvir', value: record.description || '-' },
      { key: 'assignee', label: 'İcraçı', value: record.assignee_details || '-' },
      { key: 'created_by', label: 'Yaradan', value: record.created_by_details || '-' },
      { key: 'priority', label: 'Prioritet', value: record.priority || '-' },
      { key: 'status', label: 'Status', value: record.status || '-' },
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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Başlıq', dataIndex: 'title', key: 'title' },
    { title: 'İcraçı', dataIndex: 'assignee_details', key: 'assignee_details' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag>{status}</Tag>
    },
    {
      title: 'Prioritet',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag>{priority}</Tag>
    },
    {
      title: 'Təsdiqləndi',
      dataIndex: 'approved',
      key: 'approved',
      render: (approved) => (
        <Tag color={approved ? 'success' : 'warning'}>{approved ? 'Bəli' : 'Xeyr'}</Tag>
      )
    },
    {
      title: 'Əməliyyatlar',
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Redaktə et">
            <EditOutlined
              style={{ color: '#1890ff', cursor: 'pointer', fontSize: '18px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Sil">
            <DeleteOutlined
              style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '18px' }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record);
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Tapşırıqlar</h2>
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        <div className="flex gap-2 mb-6">
          <Button
            onClick={handleAddClick}
            type="primary"
            icon={<PlusOutlined />}
            disabled={loading}
          >
            Yeni tapşırıq
          </Button>
          <Button onClick={() => dispatch(fetchTasks())} icon={<SyncOutlined />} loading={loading}>
            Yenilə
          </Button>
        </div>
        <ReusableTable
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
          onRowClick={handleRowClick}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
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

      {contextHolder}

      <BaseModal
        title={mode === 'add' ? 'Yeni Tapşırıq' : 'Tapşırığı Redaktə et'}
        open={isAddEditOpen}
        onOk={() => form.submit()}
        onCancel={handleAddEditCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <AppForm form={form} fields={formFields} onFinish={handleFormFinish} />
      </BaseModal>
    </div>
  );
}

export default Task;
