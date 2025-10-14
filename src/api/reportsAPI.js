import apiService from './apiService';

const reportsAPI = {
  getActivityLogs: (params) => {
    return apiService.get('/reports/activity-logs/', params);
  },
};

export default reportsAPI;