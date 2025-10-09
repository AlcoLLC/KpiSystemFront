import apiService from './apiService';
import { formatForAPI } from '../utils/dateFormatter';

const performanceAPI = {
    getMyPerformanceCard: (date) => {
        const params = { date: formatForAPI(date).substring(0, 7) };
        return apiService.get('/performance/user-evaluations/my-performance-card/', params);
    },

    getPerformanceSummary: (evaluateeId, date) => {
        const params = {
            evaluatee_id: evaluateeId,
            date: formatForAPI(date).substring(0, 7)
        };
        return apiService.get('/performance/user-evaluations/performance-summary/', params);
    },

    getMonthlyScores: (evaluateeId, date) => {
        const params = {
            evaluatee_id: evaluateeId,
            date: formatForAPI(date).substring(0, 7)
        };
        return apiService.get('/performance/user-evaluations/monthly-scores/', params);
    },

    getEvaluableUsers: (date, departmentId) => {
        const params = {
            date: formatForAPI(date).substring(0, 7),
            ...(departmentId && { department: departmentId })
        };
        return apiService.get('/performance/user-evaluations/evaluable-users/', { params });
    },

    getDepartments: () => {
        return apiService.get('/accounts/departments/');
    },

    createEvaluation: (data) => {
        return apiService.post('/performance/user-evaluations/', data);
    },

    updateEvaluation: (id, data) => {
        return apiService.patch(`/performance/user-evaluations/${id}/`, data);
    },
};

export default performanceAPI;