import { toast } from 'react-toastify';
import { store } from '~/Redux/store';
import DomainApi from '.';

const apiClient = DomainApi;

// Thêm token nếu có
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().FetchApi.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Hiển thị lỗi chung
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error?.response?.data || error.message || 'Lỗi không xác định!';
        toast.error(message);
        return Promise.reject(error);
    },
);

export default apiClient;
