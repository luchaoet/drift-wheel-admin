import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/Main";

import Login from '../pages/Login';
import Category from "../pages/Category";
import Product from "../pages/Product";
import ProductCreateOrEdit from "../pages/ProductCreateOrEdit";
import Images from "../pages/Images";
import VehicleGalleries from '../pages/VehicleGalleries'


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
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
        path: "category",
        element: <Category />
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/create",
        element: <ProductCreateOrEdit />,
      },
      {
        path: "product/:categoryId/:productId",
        element: <ProductCreateOrEdit />,
      },
      {
        path: "images",
        element: <Images />,
      }, {
        path: "vehicle-galleries",
        element: <VehicleGalleries />
      }
    ]
  }
], {
  basename: '/manage'
});
export default router;