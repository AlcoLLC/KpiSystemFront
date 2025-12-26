import apiService from './apiService';

const productionApi = {
    getProductions: (params) => apiService.get('/equipment/productions/', params),
    createProduction: (data) => apiService.post('/equipment/productions/', data),
    updateProduction: (id, data) => apiService.put(`/equipment/productions/${id}/`, data),
    deleteProduction: (id) => apiService.delete(`/equipment/productions/${id}/`),
    getEquipments: () => apiService.get('/equipment/equipments/'),
    getFactoryEmployees: () => apiService.get('/equipment/factory-employees/'),
};

export default productionApi;