import axios from 'axios';
import auth from './utils/auth';

const baseURL = `${process.env.API_URL}`;
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
};

const instance = axios.create({
  baseURL,
  timeout: 6000 * 10,
  headers: headers,
});

/**
 * Request interceptor
 * Add Authorization header if it exists
 * This configuration applies for all requests
 */
instance.interceptors.request.use(
  (reqConfig) => {
    const token = auth.getToken();
    if (token) {
      let token_type = 'Bearer';
      if (!reqConfig.headers) {
        reqConfig.headers = {};
      }
      reqConfig.headers.Authorization = `${token_type} ${token}`;
    } else {
      if (!reqConfig.headers) {
        reqConfig.headers = {};
      }
    }
    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do something with response error
    if (typeof error === 'undefined') {
      // request cancelled
      // when backend server is not available at all
    } else if (typeof error.response === 'undefined') {
      // when request is timeout
    } else if (error.response.status === 401) {
      // apply refresh token logic here instead of redirecting to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default instance;
