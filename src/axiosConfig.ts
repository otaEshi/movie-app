import axios, { InternalAxiosRequestConfig } from "axios";
import { trackPromise } from "react-promise-tracker";

type RefreshTokenRequestFunction = () => Promise<void | { idToken: string, refreshToken: string; }>;
let refreshTokenRequest: any = null;

// Inject id_token for authorization
export const handleAxiosRequest = async (config: InternalAxiosRequestConfig) => {
    if (config.url === "/auth/refresh_token") {
        // Refresh token
        let refresh_token = localStorage.getItem('refresh_token');
        config.headers.set('Authorization', "Bearer " + refresh_token);
    } else {
        let urlArray = config.url?.split('/');
        let id_token = localStorage.getItem('id_token');
        if (id_token && urlArray && urlArray[urlArray.length - 1] !== 'auth') {
            config.headers.set('Authorization', "Bearer " + id_token);
        }
    }
    return config;
};

/** Keep all the pending apis failed by token expiring to request them later */
export const handleAxiosReponseError = async (error: any) => {
    const originalRequest = error.config;
    if (error.response.status === axios.HttpStatusCode.Unauthorized && !originalRequest.url.includes("auth")) {
        refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : _refreshToken();
        let res = await refreshTokenRequest;
        if (res?.refreshToken && res?.idToken) {
            refreshTokenRequest = null;
            axios.defaults.headers.common['Authorization'] = `Bearer ${res?.idToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${res?.idToken}`;
            return axios(originalRequest);
        } else {
            return;
        }

    }
    return Promise.reject(error);
};

export const _refreshToken: RefreshTokenRequestFunction = async () => {
    const url = '/auth/refresh_token';
    try {
        return trackPromise(
            axios({ method: "POST", url: url }).then((response) => {
                if (response?.data?.idToken && response?.data?.refreshToken) {
                    refreshTokenRequest = null;
                    localStorage.setItem('id_token', response.data.idToken);
                    localStorage.setItem('refresh_token', response.data.refreshToken);
                    return {
                        idToken: response.data.idToken,
                        refreshToken: response.data.refreshToken,
                    };
                }
            }).catch(async error => {
                localStorage.removeItem('id_token');
                localStorage.removeItem('refresh_token');
                window.location.reload();
            })
        );
    } catch (error) {
        localStorage.removeItem('id_token');
        localStorage.removeItem('refresh_token');
        window.location.reload();
    }
    return;
};