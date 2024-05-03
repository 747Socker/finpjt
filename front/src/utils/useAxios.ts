// import Axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../stores/useAuthStore.ts';
//
// const useAxios = (isAuth: boolean = true): AxiosInstance => {
//     const { accessToken, clearAuth } = useAuthStore();
//     const navigate = useNavigate();
//
//     const instance = Axios.create({
//         baseURL: import.meta.env.VITE_API_BASE_URL,
//         withCredentials: true,
//     });
//
//     if (isAuth) {
//         instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//             console.log("axios accesstoken",accessToken);
//             if (!accessToken) {
//                 console.log("로그인이 필요합니다.");
//                 navigate('/');
//                 throw new Axios.Cancel("로그인이 필요한 요청입니다.");
//             }
//             config.headers = config.headers || {};
//             config.headers.Authorization = `Bearer ${accessToken}`;
//             return config;
//         });
//     }
//
//     instance.interceptors.response.use(
//         (response) => response,
//         async (error) => {
//             if (error.response && error.response.status === 401) {
//                 clearAuth();
//                 navigate('/');
//                 return Promise.reject(error);
//             }
//             return Promise.reject(error);
//         },
//     );
//
//     return instance;
// };
//
// export { useAxios };

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosRequestHeaders } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

//헤더 설정...
interface EnhancedAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
    headers: AxiosRequestHeaders;
}

const useAxios = (isAuth: boolean = true): AxiosInstance => {
    const { accessToken, setAccessToken, clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
    });

    if (isAuth) {
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers = config.headers ?? {};
            if (!accessToken) {
                console.log("로그인이 필요합니다.");
                // 비동기적으로
                setTimeout(() => navigate('/'), 0);
                throw new axios.Cancel("로그인이 필요한 요청입니다.");
            }
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            return config as EnhancedAxiosRequestConfig;
        }, error => Promise.reject(error));
    }

    instance.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
            const config = error.config as EnhancedAxiosRequestConfig;
            if (error.response?.status === 401 && !config._retry) {
                config._retry = true;

                try {
                    const response = await instance.get('/auth/reissue');
                    const newAccessToken = response.data.accessToken;
                    // reissue 리스폰스 데이터타입 확인 필요
                    setAccessToken(newAccessToken);

                    config.headers = config.headers ?? {};
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return instance.request(config);
                } catch (refreshError) {
                    clearAuth();
                    setTimeout(() => navigate('/login'), 0);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export { useAxios };

