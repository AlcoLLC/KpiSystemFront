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
};

export default accountsApi;