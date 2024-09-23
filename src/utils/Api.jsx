// api.js
import axios from 'axios';

const AGROSELVA_URL_BACKEND = process.env.AGROSELVA_URL_BACKEND;

const api = axios.create({
    baseURL: AGROSELVA_URL_BACKEND,
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
