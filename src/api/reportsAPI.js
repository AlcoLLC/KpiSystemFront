import apiService from './apiService';

const reportsAPI = {
  getActivityLogs: (params) => {
    return apiService.get('/reports/activity-logs/', params);
  },
  
  getDashboardStats: () => {
    return apiService.get('/reports/dashboard-stats/');
  },
  
  getAllUsers: () => {
    return apiService.get('/reports/users/');
  },
};

export default reportsAPI;