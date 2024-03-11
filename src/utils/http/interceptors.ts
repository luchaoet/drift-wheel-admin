import axios, { AxiosInstance, AxiosResponse } from "axios";
// @ts-ignore
import qs from 'qs'
import { message } from 'antd'


export class Interceptors {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: '',
      timeout: 30000,
      withCredentials: true,
    });
    this.init();
  }
  // 初始化拦截器
  init() {
    // 请求接口拦截器
    this.instance.interceptors.request.use(
      (config) => {

        // const { url = '', data } = config;
        if (config.method === 'get') {
          config.paramsSerializer = function (params: any) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
          }
        }

        // if (config.method === 'post' && url.indexOf('/console/') > -1) {
        //   config.data = qs.stringify(data)
        // }
        // if (document.domain !== 'localhost') {
        //   config.url = `${window.location.protocol + import.meta.env.VITE_APP_API}` + url;
        // }
        // console.log(config)
        return config;
      },
      (err) => {
        console.error(err);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const res: any = response.data;
        // const message = (response.config as any).message;
        // if (res.msgCode === "login.needLogin" || res.msgCode === 'permission.permissionDenied') {
        //   router.push("/login")
        // } else if (!res.success && message) {
        //   ShMessage.error(res.message)
        // }
        if (res.errorCode === '__200OK') {
          return Promise.resolve(res);
        } else {
          message.error(res.errorMsg);
          return Promise.reject(res);
        }
      },
      (error: any) => {
        // ShMessage({
        //   message: error,
        //   type: 'error',
        // })
        message.error(error.message || error.code || error.stack);
        return Promise.reject({ success: false });
      }
    );
  }

  getInterceptors() {
    return this.instance;
  }
}