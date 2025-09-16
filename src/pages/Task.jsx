// src/pages/Task.js

import React, { useState, useEffect, useMemo } from 'react';
import { Form, Modal, Space, Tag, message, Button, Tooltip, Input, Select, DatePicker, Row, Col, Card } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addNewTask, updateTask, deleteTask } from '../features/tasks/tasksSlice';
import { EditOutlined, DeleteOutlined, PlusOutlined, SyncOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import tasksApi from '../api/tasksApi';
import ReusableTable from '../components/ReusableTable';
import BaseModal from '../components/BaseModal';
import Details from '../components/Details';
import AppForm from '../components/AppForm';

const { useModal } = Modal;
const { RangePicker } = DatePicker;

// Status rəng konfiqurasiyası
const getStatusColor = (status) => {
  const statusColors = {
    Gözləmədə: 'orange',
    Təsdiqlənib: 'green',
    'Davam edir': 'processing',
    Tamamlanıb: 'success'
  };
  return statusColors[status] || 'default';
};

// Prioritet rəng konfiqurasiyası
const getPriorityColor = (priority) => {
  const priorityColors = {
    'Çox vacib': 'red',
    Yüksək: 'volcano',
    Orta: 'gold',
    Aşağı: 'lime'
  };
  return priorityColors[priority] || 'default';
};

// Form sahələri konfiqurasiyası
const taskFormFieldsConfig = [
  {
    name: 'title',
    label: 'Başlıq',
    type: 'text',
    rules: [{ required: true, message: 'Başlıq daxil edin!' }],
    span: 24
  },
  {
    name: 'description',
    label: 'Təsvir',
    type: 'textarea',
    span: 24
  },
  {
    name: 'priority',
    label: 'Prioritet',
    type: 'select',
    rules: [{ required: true, message: 'Prioritet seçin!' }],
    options: [
      { value: 'CRITICAL', label: 'Çox vacib' },
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
    span: 12
  },
  {
    name: 'start_date',
    label: 'Başlama tarixi',
    type: 'datepicker',
    span: 12
  },
  {
    name: 'due_date',
    label: 'Bitmə tarixi',
    type: 'datepicker',
    span: 12
  }
];

// Status və Prioritet seçimləri
const statusOptions = [
  { value: 'PENDING', label: 'Gözləmədə' },
  { value: 'TODO', label: 'Təsdiqlənib' },
  { value: 'IN_PROGRESS', label: 'Davam edir' },
  { value: 'DONE', label: 'Tamamlanıb' }
];

const priorityOptions = [
  { value: 'CRITICAL', label: 'Çox vacib' },
  { value: 'HIGH', label: 'Yüksək' },
  { value: 'MEDIUM', label: 'Orta' },
  { value: 'LOW', label: 'Aşağı' }
];

function Task() {
  const dispatch = useDispatch();
  const { items: data, status } = useSelector((state) => state.tasks);
  const loading = status === 'loading';

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [modal, contextHolder] = useModal();

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    assignee: null,
    department: null,
    date_range: null
  });
  const [filteredData, setFilteredData] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => (
      <span className="text-gray-600 dark:text-gray-300">
        {range[0]}-{range[1]} / {total} nəticə
      </span>
    )
  });

  // İlkin məlumatları yüklə
  useEffect(() => {
    fetchTasksWithFilters();
    fetchAssignableUsers();
  }, []);

  // Filterleme və axtarış dəyişdikdə
  useEffect(() => {
    fetchTasksWithFilters();
  }, [searchText, filters, pagination.current, pagination.pageSize]);

  // API-dən taskları filterlə və yüklə
  const fetchTasksWithFilters = async () => {
    try {
      const params = {
        page: pagination.current,
        page_size: pagination.pageSize,
        search: searchText || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        assignee: filters.assignee || undefined,
        department: filters.department || undefined
      };

      // Tarix aralığı
      if (filters.date_range && filters.date_range.length === 2) {
        params.start_date_after = filters.date_range[0].format('YYYY-MM-DD');
        params.due_date_before = filters.date_range[1].format('YYYY-MM-DD');
      }

      // Boş parametrləri silmək
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === null || params[key] === '') {
          delete params[key];
        }
      });

      const response = await tasksApi.getTasks(params);
      const responseData = response.data;

      setFilteredData(responseData.results || responseData || []);
      setPagination(prev => ({
        ...prev,
        total: responseData.count || (Array.isArray(responseData) ? responseData.length : 0)
      }));
    } catch (error) {
      console.error('Taskları yükləmək alınmadı:', error);
      message.error('Tapşırıqları yükləmək mümkün olmadı.');
      setFilteredData([]);
    }
  };

  // İcraçı siyahısını yüklə
  const fetchAssignableUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await tasksApi.getAssignableUsers();
      const usersData = response.data.results || response.data || [];
      setUsers(usersData);

      // Departmentləri extract et
      const uniqueDepartments = [];
      const seenDepartments = new Set();
      
      usersData.forEach(user => {
        if (user.department && !seenDepartments.has(user.department.id)) {
          uniqueDepartments.push({
            id: user.department.id,
            name: user.department.name
          });
          seenDepartments.add(user.department.id);
        }
      });
      
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error('İstifadəçiləri yükləmək alınmadı:', err);
      message.error('İcraçı siyahısını yükləmək mümkün olmadı.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Form sahələrini hazırla
  const formFields = useMemo(() => {
    const userOptions = users.map((user) => ({
      value: user.id,
      label:
        user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username
    }));

    return taskFormFieldsConfig.map((field) =>
      field.name === 'assignee' ? { ...field, options: userOptions, loading: usersLoading } : field
    );
  }, [users, usersLoading]);

  // Modal açıldıqda formu doldur
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

  // Handler funksiyaları
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
          fetchTasksWithFilters(); // Yenidən yüklə
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
      fetchTasksWithFilters(); // Yenidən yüklə
    } catch (err) {
      console.error('Form submit error:', err);
      message.error(typeof err === 'string' ? err : 'Əməliyyat uğursuz oldu.');
    }
  };

  // Axtarış və filter handlers
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilters({
      status: null,
      priority: null,
      assignee: null,
      department: null,
      date_range: null
    });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (paginationInfo) => {
    setPagination(prev => ({
      ...prev,
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    }));
  };

  // Təfərrüat məlumatları
  const generateDetailsItems = (record) => {
    if (!record) return [];
    return [
      { key: 'title', label: 'Başlıq', value: record.title },
      { key: 'description', label: 'Təsvir', value: record.description || '-' },
      { key: 'assignee', label: 'İcraçı', value: record.assignee_details || '-' },
      { key: 'created_by', label: 'Yaradan', value: record.created_by_details || '-' },
      { key: 'priority', label: 'Prioritet', value: record.priority_display || '-' },
      { key: 'status', label: 'Status', value: record.status_display || '-' },
      {
        key: 'start_date',
        label: 'Başlama tarixi',
        value: dayjs(record.start_at).format('DD MMMM YYYY') || '-'
      },
      {
        key: 'due_date',
        label: 'Bitmə tarixi',
        value: dayjs(record.due_date).format('DD MMMM YYYY') || '-'
      },
      { key: 'approved', label: 'Təsdiqləndi', value: record.approved ? 'Bəli' : 'Xeyr' },
      {
        key: 'created_at',
        label: 'Yaradılma tarixi',
        value: record.created_at ? dayjs(record.created_at).format('DD MMMM YYYY HH:mm') : '-'
      }
    ];
  };

  // Cədvəl sütunları
  const columns = [
    {
      title: '№',
      key: 'index',
      width: 60,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    { title: 'Başlıq', dataIndex: 'title', key: 'title', width: 200 },
    { title: 'İcraçı', dataIndex: 'assignee_details', key: 'assignee_details', width: 120 },
    {
      title: 'Status',
      dataIndex: 'status_display',
      key: 'status',
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    {
      title: 'Prioritet',
      dataIndex: 'priority_display',
      key: 'priority',
      width: 100,
      render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>
    },
    {
      title: 'Başlama',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 100,
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-')
    },
    {
      title: 'Bitmə',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 100,
      render: (date) => (date ? dayjs(date).format('DD MMM YYYY') : '-')
    },
    {
      title: 'Təsdiqləndi',
      dataIndex: 'approved',
      key: 'approved',
      width: 100,
      render: (approved) => (
        <Tag color={approved ? 'success' : 'volcano'}>{approved ? 'Bəli' : 'Xeyr'}</Tag>
      )
    },
    {
      title: 'Əməliyyatlar',
      key: 'action',
      fixed: 'right',
      width: 120,
      align: 'center',
      className: 'dark:bg-[#1B232D]',
      render: (_, record) => (
        <Space size={8}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <EditOutlined style={{ fontSize: '20px' }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            <DeleteOutlined style={{ fontSize: '20px' }} />
          </button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Tapşırıqlar</h2>
      
      <div className="p-6 rounded-lg shadow-md transition-colors duration-500 bg-white dark:bg-[#1B232D]">
        {/* Üst hissə - Düymələr və Axtarış */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                onClick={handleAddClick}
                type="primary"
                icon={<PlusOutlined />}
                disabled={loading}
              >
                Yeni tapşırıq
              </Button>
              <Button 
                onClick={() => {
                  dispatch(fetchTasks());
                  fetchTasksWithFilters();
                }} 
                icon={<SyncOutlined />} 
                loading={loading}
              >
                Yenilə
              </Button>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                icon={<FilterOutlined />}
                type={showFilters ? 'primary' : 'default'}
              >
                Filterlər
              </Button>
              <Button
                onClick={handleClearFilters}
                icon={<ClearOutlined />}
                disabled={!searchText && Object.values(filters).every(v => !v)}
              >
                Təmizlə
              </Button>
            </div>
            
            <div className="flex-1 max-w-md">
              <Input.Search
                placeholder="Başlıq və ya təsvirdə axtarın..."
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Filterlər Paneli */}
          {showFilters && (
            <Card 
              size="small" 
              className="mb-4 bg-gray-50 dark:bg-[#2A3441]"
              bodyStyle={{ padding: '16px' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Status
                    </label>
                    <Select
                      placeholder="Status seçin"
                      allowClear
                      style={{ width: '100%' }}
                      value={filters.status}
                      onChange={(value) => handleFilterChange('status', value)}
                      options={statusOptions}
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Prioritet
                    </label>
                    <Select
                      placeholder="Prioritet seçin"
                      allowClear
                      style={{ width: '100%' }}
                      value={filters.priority}
                      onChange={(value) => handleFilterChange('priority', value)}
                      options={priorityOptions}
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      İcraçı
                    </label>
                    <Select
                      placeholder="İcraçı seçin"
                      allowClear
                      showSearch
                      style={{ width: '100%' }}
                      value={filters.assignee}
                      onChange={(value) => handleFilterChange('assignee', value)}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      options={users.map(user => ({
                        value: user.id,
                        label: user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : user.username
                      }))}
                    />
                  </div>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Tarix aralığı
                    </label>
                    <RangePicker
                      style={{ width: '100%' }}
                      placeholder={['Başlama', 'Bitmə']}
                      format="DD.MM.YYYY"
                      value={filters.date_range}
                      onChange={(dates) => handleFilterChange('date_range', dates)}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </div>

        {/* Cədvəl */}
        <ReusableTable
          columns={columns}
          dataSource={filteredData}
          onRowClick={handleRowClick}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          rowClassName="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2A3441]"
        />
      </div>

      {/* Təfərrüat modalı */}
      <BaseModal
        title="Tapşırıq Məlumatları"
        open={isViewOpen}
        onCancel={() => setIsViewOpen(false)}
        footer={null}
      >
        <Details items={generateDetailsItems(currentRecord)} />
      </BaseModal>

      {/* Əlavə/Redaktə modalı */}
      <BaseModal
        title={mode === 'add' ? 'Yeni Tapşırıq' : 'Tapşırığı Redaktə et'}
        open={isAddEditOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsAddEditOpen(false)}
        confirmLoading={loading}
        destroyOnClose
      >
        <AppForm form={form} fields={formFields} onFinish={handleFormFinish} />
      </BaseModal>

      {contextHolder}
    </div>
  );
}

export default Task;