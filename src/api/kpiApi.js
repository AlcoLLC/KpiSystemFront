import apiService from "./apiService";

const kpiAPI = {
  getEvaluations: (params = {}) => {
    return apiService.get("/kpis/kpi/", { params });
  },

  createEvaluation: (data) => {
    return apiService.post("/kpis/kpi/", data);
  },

  updateEvaluation: (id, data) => {
    return apiService.patch(`/kpis/kpi/${id}/`, data);
  },

  deleteEvaluation: (id) => {
    return apiService.delete(`/kpis/kpi/${id}/`);
  },

  getEvaluationDetail: (id) => {
    return apiService.get(`/kpis/kpi/${id}/`);
  },

  getUserGivenEvaluations: (userId) => {
    return apiService.get("/kpis/kpi/", {
      params: { evaluator: userId },
    });
  },

  getUserReceivedEvaluations: (userId) => {
    return apiService.get("/kpis/kpi/", {
      params: { evaluatee: userId },
    });
  },

  getTaskEvaluations: (taskId) => {
    return apiService.get("/kpis/kpi/", {
      params: { task: taskId },
    });
  },

  getSelfEvaluations: (userId) => {
    return apiService.get("/kpis/kpi/", {
      params: {
        evaluatee: userId,
        evaluation_type: "SELF",
      },
    });
  },

  getSuperiorEvaluations: (userId) => {
    return apiService.get("/kpis/kpi/", {
      params: {
        evaluatee: userId,
        evaluation_type: "SUPERIOR",
      },
    });
  },

  getKpiDashboardTasks: (params) => {
    return apiService.get("/kpis/kpi/dashboard-tasks/", { params });
  },

  getPendingForMe: () => {
    return apiService.get("/kpis/kpi/pending-for-me/");
  },

  getNeedSelfEvaluation: () => {
    return apiService.get("/kpis/kpi/need-self-evaluation/");
  },

  getWaitingSuperiorEvaluation: () => {
    return apiService.get("/kpis/kpi/waiting-superior-evaluation/");
  },

  getIEvaluated: () => {
    return apiService.get("/kpis/kpi/i-evaluated/");
  },

  getSubordinatesNeedEvaluation: () => { 
    return apiService.get("/kpis/kpi/subordinates-need-evaluation/");
  },
  
  // YENİ FUNKSİYA
  getCompletedEvaluations: () => {
    return apiService.get("/kpis/kpi/completed-evaluations/");
  },
  
};

export default kpiAPI;
