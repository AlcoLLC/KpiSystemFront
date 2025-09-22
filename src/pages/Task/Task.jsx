import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, message, Button, Input, Radio, Empty  } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask, addNewTask, deleteTask } from '../../features/tasks/tasksSlice';
import { PlusOutlined, SearchOutlined, FilterOutlined, ClearOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import tasksApi from '../../api/tasksApi';
import ReusableTable from '../../components/ReusableTable';
import { useTaskPermissions } from './hooks/useTaskPermissions';
import { getTaskColumns } from './utils/TaskColumns.jsx';
import { STATUS_OPTIONS, STATUS_TRANSITIONS } from './utils/taskConstants';
import TaskFilters from './components/TaskFilters';
import TaskDetailsModal from './components/TaskDetailsModal';
import TaskFormModal from './components/TaskFormModal';
import { useDebounce } from '../../hooks/useDebounce';

const { useModal } = Modal;

function Task() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { status: reduxStatus } = useSelector(state => state.tasks);
  const loading = reduxStatus === 'loading';
  const [modal, contextHolder] = useModal();

  // State Management
  const [viewMode, setViewMode] = useState('team'); 
  const permissions = useTaskPermissions(viewMode);

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [mode, setMode] = useState('add');
  const [currentRecord, setCurrentRecord] = useState(null);

  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  
  const [filters, setFilters] = useState({ status: null, priority: null, assignee: null, date_range: null });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1, pageSize: 10, total: 0, showTotal: (total, range) => <span className="text-gray-600 dark:text-gray-300">{range[0]}-{range[1]} / {total} nəticə</span>
  });

  useEffect(() => {
    if (permissions.isEmployee) setViewMode('my');
    if (permissions.userRole === 'top_management') setViewMode('team');
  }, [permissions.isEmployee, permissions.userRole]);

  const fetchTasksWithFilters = useCallback(async () => {
    if (!user) return;
    
    const params = {
      page: pagination.current, page_size: pagination.pageSize,
      search: debouncedSearchText || undefined,
      status: filters.status || undefined, priority: filters.priority || undefined,
    };

    if (viewMode === 'my' || permissions.isEmployee) {
        params.assignee = user.id;
    } else {
        params.assignee = filters.assignee || undefined;
    }

    if (filters.date_range?.length === 2) {
      params.start_date_after = filters.date_range[0].format('YYYY-MM-DD');
      params.due_date_before = filters.date_range[1].format('YYYY-MM-DD');
    }
    Object.keys(params).forEach(key => !params[key] && delete params[key]);

    try {
      const response = await tasksApi.getTasks(params);
      const responseData = response.data;
      setData(responseData.results || responseData || []);
      setPagination(prev => ({ ...prev, total: responseData.count || 0 }));
    } catch (error) {
      message.error('Tapşırıqları yükləmək mümkün olmadı.');
      setData([]);
    }
  }, [pagination.current, pagination.pageSize, debouncedSearchText, filters, viewMode, permissions.isEmployee, user]);

  useEffect(() => {
    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await tasksApi.getAssignableUsers();
            setUsers(response.data.results || response.data || []);
        } catch (err) {
            message.error('İcraçı siyahısını yükləmək mümkün olmadı.');
        } finally {
            setUsersLoading(false);
        }
    };
    fetchUsers();
  }, []);

  useEffect(() => { fetchTasksWithFilters(); }, [fetchTasksWithFilters]);

  // Event Handlers stabilized with useCallback
  const handleAddClick = useCallback(() => { setMode('add'); setCurrentRecord(null); setIsAddEditOpen(true); }, []);
  const handleEdit = useCallback((record) => { setMode('edit'); setCurrentRecord(record); setIsAddEditOpen(true); }, []);
  const handleRowClick = useCallback((record) => { setCurrentRecord(record); setIsViewOpen(true); }, []);
  const handleFilterChange = useCallback((name, value) => {
      setFilters(prev => ({ ...prev, [name]: value }));
      setPagination(prev => ({ ...prev, current: 1 }));
  }, []);
  const handleTableChange = useCallback((paginationInfo) => { setPagination(prev => ({ ...prev, current: paginationInfo.current, pageSize: paginationInfo.pageSize })); }, []);
  const handleClearFilters = useCallback(() => {
    setSearchText('');
    setFilters({ status: null, priority: null, assignee: null, date_range: null });
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);
  const handleViewModeChange = useCallback((e) => { setViewMode(e.target.value); handleClearFilters(); }, [handleClearFilters]);
  
  const showConfirmation = useCallback((config) => modal.confirm(config), [modal]);
  
  const handleStatusChange = useCallback((record) => {
    const transition = STATUS_TRANSITIONS[record.status];
    if (!transition) return;
    const currentStatusLabel = STATUS_OPTIONS.find(s => s.value === record.status)?.label;
    const nextStatusLabel = STATUS_OPTIONS.find(s => s.value === transition.next)?.label;
    
    showConfirmation({
        title: 'Status dəyişikliyini təsdiqləyin',
        content: `'${record.title}' tapşırığının statusunu '${currentStatusLabel}'-dan '${nextStatusLabel}'-a dəyişmək istəyirsiniz?`,
        okText: 'Təsdiq et', okType: 'primary', cancelText: 'Ləğv et',
        onOk: async () => {
            try {
                await dispatch(updateTask({ id: record.id, taskData: { ...record, status: transition.next } })).unwrap();
                message.success('Status uğurla dəyişdirildi');
                fetchTasksWithFilters();
            } catch (err) {
                message.error(err.message || 'Status dəyişərkən xəta baş verdi');
            }
        }
    });
  }, [dispatch, fetchTasksWithFilters, showConfirmation]);

  const handleDelete = useCallback((record) => {
    showConfirmation({
      title: 'Silinməni təsdiqləyin',
      content: `'${record.title}' adlı tapşırığı silmək istədiyinizə əminsiniz?`,
      okText: 'Sil', okType: 'danger', cancelText: 'Ləğv et',
      onOk: async () => {
        try {
          await dispatch(deleteTask(record.id)).unwrap();
          message.success('Tapşırıq uğurla silindi');
          fetchTasksWithFilters();
        } catch (err) {
          message.error(err.message || 'Tapşırığı silərkən xəta baş verdi');
        }
      }
    });
  }, [dispatch, fetchTasksWithFilters, showConfirmation]);

  const handleFormFinish = useCallback(async (values) => {
    const payload = {
      ...values,
      start_date: values.start_date?.format('YYYY-MM-DD') || null,
      due_date: values.due_date?.format('YYYY-MM-DD') || null
    };

    if (mode === 'add' && permissions.formConfig?.defaultValues) {
        Object.assign(payload, permissions.formConfig.defaultValues);
    }
    
    try {
      if (mode === 'add') {
        await dispatch(addNewTask(payload)).unwrap();
        message.success('Tapşırıq uğurla yaradıldı');
      } else {
        await dispatch(updateTask({ id: currentRecord.id, taskData: payload })).unwrap();
        message.success('Tapşırıq uğurla yeniləndi');
      }
      setIsAddEditOpen(false);
      fetchTasksWithFilters();
    } catch (err) {
      message.error(typeof err === 'string' ? err : 'Əməliyyat uğursuz oldu.');
    }
  }, [dispatch, fetchTasksWithFilters, mode, currentRecord, permissions.formConfig]);

  const columns = useMemo(() => getTaskColumns(pagination, { handleEdit, handleDelete, handleStatusChange }, permissions), [pagination, permissions, handleEdit, handleDelete, handleStatusChange]);
  
  const hasActiveFilters = debouncedSearchText || Object.values(filters).some(v => v);

  if (!permissions.canViewPage) return null;

  const tableLocale = {
        emptyText: <Empty description="Məlumat tapılmadı" />
    };

  return (
    <div>
      <h2 className="px-1 text-xl font-medium mb-6 text-black dark:text-white">Tapşırıqlar</h2>
      {permissions.showViewSwitcher && (
        <div className="mb-4">
          <Radio.Group value={viewMode} onChange={handleViewModeChange}>
            <Radio.Button value="my"><UserOutlined /> Mənim tapşırıqlarım</Radio.Button>
            <Radio.Button value="team"><TeamOutlined /> Əməkdaşların tapşırıqları</Radio.Button>
          </Radio.Group>
        </div>
      )}
      <div className="p-6 rounded-lg shadow-md bg-white dark:bg-[#1B232D]">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-2">
              {permissions.canCreate && <Button onClick={handleAddClick} type="primary" icon={<PlusOutlined />} disabled={loading}>Yeni tapşırıq</Button>}
              <Button onClick={() => setShowFilters(s => !s)} icon={<FilterOutlined />} type={showFilters ? 'primary' : 'default'}>Filterlər</Button>
              <Button onClick={handleClearFilters} icon={<ClearOutlined />} disabled={!hasActiveFilters}>Təmizlə</Button>
            </div>
            <div className="flex-1 max-w-md">
              <Input.Search
                placeholder="Başlıq və ya təsvirdə axtarın..."
                allowClear enterButton={<SearchOutlined />} size="middle"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>
          </div>
          {showFilters && <TaskFilters filters={filters} onFilterChange={handleFilterChange} users={users} permissions={permissions} />}
        </div>
        <ReusableTable locale={tableLocale} columns={columns} dataSource={data} onRowClick={handleRowClick} pagination={pagination} onChange={handleTableChange} rowKey="id" loading={loading} scroll={{ x: 1000 }} rowClassName="cursor-pointer" />
      </div>
      <TaskDetailsModal open={isViewOpen} onCancel={() => setIsViewOpen(false)} record={currentRecord} />
      <TaskFormModal open={isAddEditOpen} mode={mode} initialData={currentRecord} onCancel={() => setIsAddEditOpen(false)} onFinish={handleFormFinish} loading={loading} users={users} usersLoading={usersLoading} permissions={permissions} />
      {contextHolder}
    </div>
  );
}

export default Task;