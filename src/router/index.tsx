import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/Main";

import Login from '../pages/Login';
import Home from "../pages/Home";
import Product from "../pages/Product";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        // 路由重定向, 借助Navigate组件跳转
        element: <Navigate to="login" replace />,
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "product",
        element: <Product />,
      }
    ]
  }
]);
export default router;