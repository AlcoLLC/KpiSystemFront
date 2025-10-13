import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import accountsApi from '../../../api/accountsApi';

const apiMap = {
  users: {
    get: accountsApi.getUsers,
    create: accountsApi.createUser,
    update: accountsApi.updateUser,
    delete: accountsApi.deleteUser
  },
  departments: {
    get: accountsApi.getDepartments,
    create: accountsApi.createDepartment,
    update: accountsApi.updateDepartment,
    delete: accountsApi.deleteDepartment
  },
  positions: {
    get: accountsApi.getPositions,
    create: accountsApi.createPosition,
    update: accountsApi.updatePosition,
    delete: accountsApi.deletePosition
  }
};

export const useManagementData = (resourceType) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = useMemo(() => apiMap[resourceType], [resourceType]);

  const fetchData = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const response = await api.get(params);
        setItems(response.data.results || response.data || []);
      } catch (error) {
        message.error(`${resourceType} məlumatlarını yükləmək mümkün olmadı.`);
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [api, resourceType]
  );
  
  const createItem = async (data) => {
    await api.create(data);
    await fetchData();
  };

  const updateItem = async (id, data) => {
    await api.update(id, data);
    await fetchData();
  };

  const deleteItem = async (id) => {
    await api.delete(id);
    await fetchData();
  };

  return { items, loading, fetchData, createItem, updateItem, deleteItem };
};
