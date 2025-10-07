import apiService from './apiService';

const tasksApi = {
  getTasks: (params = {}) => apiService.get('/tasks/tasks/', params), 
  createTask: (taskData) => apiService.post('/tasks/tasks/', taskData), 
  updateTask: (taskId, taskData) => apiService.patch(`/tasks/tasks/${taskId}/`, taskData), 
  deleteTask: (taskId) => apiService.delete(`/tasks/tasks/${taskId}/`), 
  getTask: (taskId) => apiService.get(`/tasks/tasks/${taskId}/`), 
  verifyTask: (token) => apiService.get(`/tasks/tasks/verify/${token}/`), 
  getAssignableUsers: () => apiService.get("/tasks/assignable-users/"), 
  getMonthlyStats: () => apiService.get('/tasks/stats/monthly/'),
  getPriorityStats: () => apiService.get('/tasks/stats/priority/'),
  getHomeStats: () => apiService.get('/tasks/home-stats/'),
  getSubordinates: (params = {}) => apiService.get('/performance/subordinates/', params),
  getPerformanceSummary: (slug) => {
    if (slug) {
      return apiService.get(`/performance/summary/${slug}/`);
    }
    return apiService.get('/performance/summary/me/');
  },

  getFilterableDepartments: () => apiService.get('/performance/filterable-departments/'),
  
};

export default tasksApi;