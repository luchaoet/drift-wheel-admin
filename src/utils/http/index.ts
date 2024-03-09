import { AxiosPromise, AxiosResponse } from "axios";
import { Interceptors } from "./interceptors";

const axios = new Interceptors().getInterceptors();

const request = (config: any): AxiosPromise => {
  const url = config.url;
  const data = config.data || {};
  const method = config?.method?.toLowerCase();
  const message = config?.message ?? true;
  const _config = {
    ...config,
    data,
    method,
    message
  }
  let http: any = null;
  switch (method) {
    case 'post': http = axios.post(url, data, _config); break;
    case 'put': http = axios.put(url, data, _config); break;
    case 'delete': http = axios.delete(url, _config); break;
    default: http = axios.get(url, { params: data, ..._config });
  }


  return new Promise((resolve, reject) => {
    http.then((res: AxiosResponse) => {
      resolve(res);
    }).catch((err: any) => {
      reject(err)
    });
  });
}

export default request;

export interface Pager {
  currentPage: number;
  endRow: number;
  limit: number;
  offset: number;
  pageSize: number;
  startRow: number;
  total: number;
  totalPage: number;
}

export interface Response {
  code: string;
  data: Array<any> | object;
  message: string | null;
  msgCode: string;
  pager: null | Pager
  requestId: string;
  success: Boolean
}