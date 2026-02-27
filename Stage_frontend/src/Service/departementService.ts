import api from './api';

export const getDepartements = () => api.get('/departements');
export const getDepartementById = (id: number) => api.get(`/departements/${id}`);
export const createDepartement = (data: any) => api.post('/departements', data);
export const updateDepartement = (id: number, data: any) => api.put(`/departements/${id}`, data);
export const deleteDepartement = (id: number) => api.delete(`/departements/${id}`);
