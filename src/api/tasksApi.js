import apiService from './apiService';

const tasksApi = {
  // Bütün taskları əldə et
  getTasks: (params = {}) => apiService.get('/tasks/', params),

  // Yeni task yarat
  createTask: (taskData) => apiService.post('/tasks/', taskData),

  // Task-ı yenilə
  updateTask: (taskId, taskData) => apiService.patch(`/tasks/${taskId}/`, taskData),

  // Task-ı sil
  deleteTask: (taskId) => apiService.delete(`/tasks/${taskId}/`),

  // Spesifik task əldə et
  getTask: (taskId) => apiService.get(`/tasks/${taskId}/`),

  // Task verification (email linkləri üçün)
  verifyTask: (token) => apiService.get(`/tasks/verify/${token}/`),
};

export default tasksApi;