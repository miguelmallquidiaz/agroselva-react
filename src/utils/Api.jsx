import axios from 'axios';
import config from './config';

const api = axios.create({
    baseURL: config.API_BASE_URL+'api/v1',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
