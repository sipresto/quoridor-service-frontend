import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const setupAxiosInterceptors = (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                console.log('Token expired or invalid. Redirecting to platform...');

                localStorage.removeItem('gameAccessToken');
                sessionStorage.removeItem('gameAccessToken');

                setTimeout(() => {
                    window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173';
                }, 1000);
            }

            return Promise.reject(error);
        }
    );
};

export default apiClient;