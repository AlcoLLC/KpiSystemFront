import apiService from './apiService';

const tasksApi = {
  // Bütün taskları əldə et
  getTasks: (params = {}) => apiService.get('/tasks/tasks/', params), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/

  // Yeni task yarat
  createTask: (taskData) => apiService.post('/tasks/tasks/', taskData), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/

  // Task-ı yenilə
  updateTask: (taskId, taskData) => apiService.patch(`/tasks/tasks/${taskId}/`, taskData), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/

  // Task-ı sil
  deleteTask: (taskId) => apiService.delete(`/tasks/tasks/${taskId}/`), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/

  // Spesifik task əldə et
  getTask: (taskId) => apiService.get(`/tasks/tasks/${taskId}/`), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/

  // Task verification (email linkləri üçün)
  verifyTask: (token) => apiService.get(`/tasks/tasks/verify/${token}/`), // DƏYİŞİKLİK: /tasks/ -> /tasks/tasks/
};

export default tasksApi;