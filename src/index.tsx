import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom'
import router from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';


import './index.css';
import '@luchao/base-css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  // <React.StrictMode>
  // antd全局配置
  <ConfigProvider componentSize="large" locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
