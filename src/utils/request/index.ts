import { message } from 'antd';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
enum RequestEnums {
  TIMEOUT = 10000, // 请求超时 request timeout
  FAIL = 500, // 服务器异常 server error
  LOGINTIMEOUT = 401, // 登录超时 login timeout
  SUCCESS = 200, // 请求成功 request successfully
}
const requestInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true, // 跨越的时候允许携带凭证
});
// 请求拦截器
requestInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('musictoken');
    token && config.headers.set('musictoken', token);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

requestInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, config } = response;
    if (data.code === RequestEnums.LOGINTIMEOUT) {
      //登录信息过期
      message.warning('登录信息过期，请重新登录').then(() => {
        const navigate = useNavigate();
        navigate('/login');
      });
    }
    if (config.headers['Accept']) {
      response.headers['Content-Type'] = config.headers['Accept'];
    }
    if (data?.code && data.code !== RequestEnums.SUCCESS) {
      message.error(data);
      return Promise.reject(data);
    }
    return data;
  },
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      handleCode(response.status);
    }
    if (!window.navigator.onLine) {
      message.error('网络连接失败,请检查网络');
    }
    return Promise.reject(error);
  },
);
const handleCode = (code: number): void => {
  switch (code) {
    case 401:
      message.error('登陆失败，请重新登录');
      break;
    case 500:
      message.error('请求异常，请联系管理员');
      break;
    default:
      message.error('请求失败');
      break;
  }
};

export default requestInstance;
