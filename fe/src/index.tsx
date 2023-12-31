import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Provider } from 'react-redux';
import { store } from './app/store';
import axios from 'axios';
import { handleAxiosReponseError, handleAxiosRequest } from './axiosConfig';

// Axios request interceptor
axios.interceptors.request.use(
  async (config) => await handleAxiosRequest(config),
  (error) => Promise.reject(error)
);

// Axios response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => await handleAxiosReponseError(error)
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
