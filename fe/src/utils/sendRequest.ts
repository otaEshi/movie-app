
import axios, { AxiosRequestConfig, Method } from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { showAlert } from './showAlert';

export const ERROR_STATUS: { [key: string]: string; } = {
    403: "Permission denied",
    404: "Not found",
    405: "Method is not allowed",
    422: "Validation Error",
    500: "Server error",
    504: "Request timed out. Please try again.",
};
interface RequestOptions {
    payload: object,
    thunkApi: any,
    method: Method;
    defineAlert?: boolean;
    headers?: any;
}

export const sendRequest = async (url: string, options?: Partial<RequestOptions>) => {
    const method = options?.method || "GET";
    let config: AxiosRequestConfig = { method: method, url: url, headers: options?.headers };
    if (options?.payload) {
        if (method.toUpperCase() === "GET") {
            config["params"] = options.payload;
        } else {
            config["data"] = options.payload;
        }
    }

    const request = axios(config)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.log('send rq: ', error)
            if (error.response?.data.detail === "ERR_USERNAME_ALREADY_EXISTS"){
                alert('Tài khoản đã tồn tại')
                localStorage.setItem('error_sign_up', 'true')
            } else if(error.response?.status === 422){
                // if () {

                    alert('Ngày sinh không hợp lệ')
                    localStorage.setItem('error_sign_up', 'true')
                // } 
            }
            if (!options?.defineAlert) {
                if (axios.isAxiosError(error)) {
                    const statusCode = error.response?.status;
                    if (statusCode === axios.HttpStatusCode.Forbidden) {
                        showAlert("Permission denied.", "warning");
                    } else if (statusCode && ERROR_STATUS.hasOwnProperty(statusCode)) {
                        showAlert(ERROR_STATUS[statusCode], "danger");
                    } else if (statusCode === 400) {
                        showAlert(error.response?.data.detail, "danger");
                    } else if (error.response?.data.detail === "ERR_USERNAME_ALREADY_EXISTS"){
                        alert('Tài khoản đã tồn tại')
                    }
                } else {
                    showAlert("Send request failed.", "danger");
                }
            }
            return options?.thunkApi && options.thunkApi.rejectWithValue(error);
        });
    return trackPromise(request);
};