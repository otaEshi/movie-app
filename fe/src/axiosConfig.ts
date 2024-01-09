import axios, { InternalAxiosRequestConfig } from "axios";
import { trackPromise } from "react-promise-tracker";

type RefreshTokenRequestFunction = () => Promise<void | { access_token: string, refresh_token: string; }>;
let refreshTokenRequest: any = null;

// Inject access_token for authorization
export const handleAxiosRequest = async (config: InternalAxiosRequestConfig) => {
    if (config.url === "http://localhost:8000/refresh_token") {
        // Refresh token
        let refresh_token = localStorage.getItem('refresh_token');
        config.headers.set('refresh-token', refresh_token);
    } else {
        let urlArray = config.url?.split('/');
        let access_token = localStorage.getItem('access_token');
        if (access_token && urlArray && urlArray[urlArray.length - 1]) {
            config.headers.set('Authorization', "Bearer " + access_token);
        }

    }
    return config;
};

/** Keep all the pending apis failed by token expiring to request them later */
export const handleAxiosReponseError = async (error: any) => {
    const originalRequest = error.config;

    if (error.response.status === axios.HttpStatusCode.Unauthorized && error.response.data.detail === "Invalid authentication credentials" && error.response.data.detail !== "ERR_INCORRECT_OLD_PASSWORD" ) {

        refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : _refresh_token();
        let res = await refreshTokenRequest;
        if (res?.refresh_token && res?.access_token) {
            refreshTokenRequest = null;
            axios.defaults.headers.common['Authorization'] = `Bearer ${res?.access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${res?.access_token}`;
            return axios(originalRequest);
        } else {
            return;
        }

    }
    return Promise.reject(error);
};

export const _refresh_token: RefreshTokenRequestFunction = async () => {
    const url = 'http://localhost:8000/refresh_token';
    try {
        return trackPromise(
            axios({
                method: "POST",
                url: url,
            }).then((response) => {
                if (response?.data?.access_token && response?.data?.refresh_token) {
                    refreshTokenRequest = null;
                    localStorage.setItem('access_token', response.data.access_token);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                    localStorage.setItem('token_type', response.data.token_type);
                    return {
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    };
                }
            }).catch(async error => {
                localStorage.setItem('isAuthenticated', JSON.stringify(false));
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_type');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('is_refresh_page');
                window.location.reload();
            })
        );
    } catch (error) {
        localStorage.setItem('isAuthenticated', JSON.stringify(false));
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('is_refresh_page');
        window.location.reload();
    }
    return;
};