import axiosClient from './axiosClient'; 

const accountsApi = {
  login: (credentials) => axiosClient.post('/accounts/login/', credentials),
  refreshToken: (refresh) => axiosClient.post('/accounts/refresh/', { refresh }),
  logout: (refreshToken) => axiosClient.post('/accounts/logout/', { refresh: refreshToken }),
  
  getProfile: () => axiosClient.get('/accounts/users/me/'),
  updateProfile: (profileData) =>
    axiosClient.patch(`/accounts/users/me/`, profileData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
  getUsers: (params = {}) => axiosClient.get('/accounts/users/', { params }),
  createUser: (userData) => axiosClient.post('/accounts/users/', userData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateUser: (userId, userData) => axiosClient.patch(`/accounts/users/${userId}/`, userData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteUser: (userId) => axiosClient.delete(`/accounts/users/${userId}/`),

  getDepartments: (params = {}) => axiosClient.get('/accounts/departments/', { params }),
  createDepartment: (deptData) => axiosClient.post('/accounts/departments/', deptData),
  updateDepartment: (deptId, deptData) => axiosClient.patch(`/accounts/departments/${deptId}/`, deptData),
  deleteDepartment: (deptId) => axiosClient.delete(`/accounts/departments/${deptId}/`),
  getAvailableDepartments: (role) => axiosClient.get('/accounts/available-departments/', { params: { role } }),

  getPositions: (params = {}) => axiosClient.get('/accounts/positions/', { params }),
  createPosition: (posData) => axiosClient.post('/accounts/positions/', posData),
  updatePosition: (posId, posData) => axiosClient.patch(`/accounts/positions/${posId}/`, posData),
  deletePosition: (posId) => axiosClient.delete(`/accounts/positions/${posId}/`),

  getFactoryUsers: (params) => axiosClient.get('/accounts/factory/users/', { params }),
    createFactoryUser: (data) => axiosClient.post('/accounts/factory/users/', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateFactoryUser: (id, data) => axiosClient.patch(`/accounts/factory/users/${id}/`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteFactoryUser: (id) => axiosClient.delete(`/accounts/factory/users/${id}/`),

    getFactoryPositions: (params) => axiosClient.get('/accounts/factory/positions/', { params }),
    createFactoryPosition: (data) => axiosClient.post('/accounts/factory/positions/', data),
    updateFactoryPosition: (id, data) => axiosClient.patch(`/accounts/factory/positions/${id}/`, data),
    deleteFactoryPosition: (id) => axiosClient.delete(`/accounts/factory/positions/${id}/`),

    getEquipments: (params) => axiosClient.get('/equipment/equipments/', { params }),
    createEquipment: (data) => axiosClient.post('/equipment/equipments/', data),
    updateEquipment: (id, data) => axiosClient.patch(`/equipment/equipments/${id}/`, data),
    deleteEquipment: (id) => axiosClient.delete(`/equipment/equipments/${id}/`),

    getEquipmentVolumes: (params) => axiosClient.get('/equipment/volumes/', { params }),
    createEquipmentVolume: (data) => axiosClient.post('/equipment/volumes/', data),
    updateEquipmentVolume: (id, data) => axiosClient.patch(`/equipment/volumes/${id}/`, data),
    deleteEquipmentVolume: (id) => axiosClient.delete(`/equipment/volumes/${id}/`),
};

export default accountsApi;