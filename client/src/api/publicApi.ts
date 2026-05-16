import api from './index';

export const getCars = (params?: any) => api.get('/cars', { params });
export const getPopularCars = () => api.get('/cars/popular');
export const getCarById = (id: string) => api.get(`/cars/${id}`);
export const getCategories = () => api.get('/categories');
export const getPromotions = () => api.get('/promotions');
export const getBanners = () => api.get('/promotions/banners');
export const getContacts = () => api.get('/contacts');
