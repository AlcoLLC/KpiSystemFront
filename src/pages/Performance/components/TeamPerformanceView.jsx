import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Avatar, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ReusableTable from '../../../components/ReusableTable';
import tasksApi from '../../../api/tasksApi';
import { useDebounce } from '../../../hooks/useDebounce';
import accountsApi from '../../../api/accountsApi';

const TeamPerformanceView = () => {
  const navigate = useNavigate();
  const [subordinates, setSubordinates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', department: null });
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          search: debouncedSearch || undefined,
          department: filters.department || undefined
        };
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        const response = await tasksApi.getSubordinates(params);
        setSubordinates(response.data);
      } catch (error) {
        message.error("İşçilərin siyahısını yükləmək mümkün olmadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, filters.department]);

  useEffect(() => {
    const fetchDepartments = async () => {
        try {
            const response = await accountsApi.getDepartments();
            setDepartments(response.data.results || response.data || []);
        } catch (error) {
            console.error("Departamentləri yükləmək alınmadı:", error);
        }
    };
    fetchDepartments();
  }, []);

  const columns = useMemo(() => [
    { 
      title: 'İşçi', 
      dataIndex: 'full_name', 
      key: 'full_name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.profile_photo} icon={<UserOutlined />} className="mr-3" />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    { title: 'Vəzifə', dataIndex: 'role', key: 'role' },
    { title: 'Departament', dataIndex: 'department', key: 'department' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ], []);

  const handleRowClick = (record) => {
    navigate(`/performance/${record.slug}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input.Search
          placeholder="Ada görə axtar..."
          allowClear
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="flex-1 min-w-[250px]"
        />
        <Select
          placeholder="Departamentə görə filterlə"
          allowClear
          value={filters.department}
          onChange={value => setFilters(prev => ({ ...prev, department: value }))}
          className="flex-1 min-w-[250px]"
        >
          {departments.map(dep => <Select.Option key={dep.id} value={dep.id}>{dep.name}</Select.Option>)}
        </Select>
      </div>
      <ReusableTable
        columns={columns}
        dataSource={subordinates}
        loading={loading}
        onRowClick={handleRowClick}
        rowKey="id"
        rowClassName="cursor-pointer"
      />
    </div>
  );
};

export default TeamPerformanceView;