import axiosClient from './axiosClient'; 

const accountsApi = {
  login: (credentials) => axiosClient.post('/accounts/login/', credentials),

  refreshToken: (refresh) => axiosClient.post('/accounts/refresh/', { refresh }),

  logout: (refreshToken) => axiosClient.post('/accounts/logout/', { refresh: refreshToken }),

  getProfile: () => axiosClient.get('/accounts/users/me/'),

  updateProfile: (profileData) =>
    axiosClient.patch(`/accounts/users/me/`, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  getUsers: () => axiosClient.get('/accounts/users/'),

  verifyToken: (token) => axiosClient.post('/accounts/verify-token/', { token }),

  changePassword: (passwordData) => axiosClient.post('/accounts/change-password/', passwordData),

  getDepartments: () => axiosClient.get('/accounts/departments/')
};

export default accountsApi;
