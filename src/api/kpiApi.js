import apiService from "./apiService";

const kpiAPI = {
  // KPI değerlendirmelerini getir
  getEvaluations: (params = {}) => {
    return apiService.get('/kpis/kpi/', { params });
  },

  // Belirli bir görevi değerlendir
  createEvaluation: (data) => {
    return apiService.post('/kpis/kpi/', data);
  },

  // Değerlendirmeyi güncelle
  updateEvaluation: (id, data) => {
    return apiService.patch(`/kpis/kpi/${id}/`, data);
  },

  // Değerlendirmeyi sil
  deleteEvaluation: (id) => {
    return apiService.delete(`/kpis/kpi/${id}/`);
  },

  // Belirli bir değerlendirme detayını getir
  getEvaluationDetail: (id) => {
    return apiService.get(`/kpis/kpi/${id}/`);
  },

  // Kullanıcının verdiği değerlendirmeler
  getUserGivenEvaluations: (userId) => {
    return apiService.get('/kpis/kpi/', { 
      params: { evaluator: userId }
    });
  },

  // Kullanıcının aldığı değerlendirmeler
  getUserReceivedEvaluations: (userId) => {
    return apiService.get('/kpis/kpi/', { 
      params: { evaluatee: userId }
    });
  },

  // Belirli bir görevin değerlendirmelerini getir
  getTaskEvaluations: (taskId) => {
    return apiService.get('/kpis/kpi/', { 
      params: { task: taskId }
    });
  },

  // Öz değerlendirmeleri getir
  getSelfEvaluations: (userId) => {
    return apiService.get('/kpis/kpi/', { 
      params: { 
        evaluatee: userId,
        evaluation_type: 'SELF'
      }
    });
  },

  // Üst değerlendirmelerini getir
  getSuperiorEvaluations: (userId) => {
    return apiService.get('/kpis/kpi/', { 
      params: { 
        evaluatee: userId,
        evaluation_type: 'SUPERIOR'
      }
    });
  },

  // Performans raporunu getir
  getPerformanceReport: (userId, params = {}) => {
    return apiService.get(`/kpis/performance-report/${userId}/`, { 
      params 
    });
  },

  // Departman performansını getir
  getDepartmentPerformance: (departmentId, params = {}) => {
    return apiService.get(`/kpis/department-performance/${departmentId}/`, { 
      params 
    });
  },

  // KPI istatistiklerini getir
  getKpiStatistics: (params = {}) => {
    return apiService.get('/kpis/statistics/', { 
      params 
    });
  },

  // Pending evaluations (bekleyen değerlendirmeler)
  getPendingEvaluations: (userId) => {
    return apiService.get('/kpis/pending-evaluations/', { 
      params: { evaluator: userId }
    });
  },

  // Bulk evaluation (toplu değerlendirme)
  createBulkEvaluation: (evaluations) => {
    return apiService.post('/kpis/bulk-evaluation/', { evaluations });
  }
};

export default kpiAPI;