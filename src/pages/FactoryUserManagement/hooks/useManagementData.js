import { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import accountsApi from '../../../api/accountsApi';

const apiMap = {
  users: {
    get: accountsApi.getFactoryUsers,
    create: accountsApi.createFactoryUser,
    update: accountsApi.updateFactoryUser,
    delete: accountsApi.deleteFactoryUser
  },
  positions: {
    get: accountsApi.getFactoryPositions,
    create: accountsApi.createFactoryPosition,
    update: accountsApi.updateFactoryPosition,
    delete: accountsApi.deleteFactoryPosition
  },
  equipments: {
    get: accountsApi.getEquipments,
    create: accountsApi.createEquipment,
    update: accountsApi.updateEquipment,
    delete: accountsApi.deleteEquipment
  },
  volumes: {
    get: accountsApi.getEquipmentVolumes,
    create: accountsApi.createEquipmentVolume,
    update: accountsApi.updateEquipmentVolume,
    delete: accountsApi.deleteEquipmentVolume
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
