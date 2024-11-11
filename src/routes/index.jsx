import { Navigate, Route } from "react-router-dom";
import DefaultLayout from "../components/Layout/DefaultLayout";
import { Fragment } from "react";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Users from "../pages/Users";
import Products from "../pages/Products/Products";
import ProductAdd from "../pages/Products/ProductAdd";
import ProductDetail from "../pages/Products/ProductDetail";
import Category from "../pages/Categoties";
import Brands from "../pages/Brands/Brands";
import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { SiBrandfolder } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import Sizes from "../pages/Sizes/Sizes";
import Orders from "../pages/Orders/Orders";
import { CiReceipt, CiSaveDown1 } from "react-icons/ci";
import OrderDetail from "../pages/Orders/OrderDetail";
import Imports from "../pages/Imports";
import ImportAdd from "../pages/Imports/ImportAdd";
import ImportDetail from "../pages/Imports/ImportDetail";
import { FaTape } from "react-icons/fa6";

export const navigateItems = [
  { key: "/home", icon: <PieChartOutlined />, label: "Thống kê" },
  { key: "/users", icon: <UserOutlined />, label: "Người dùng" },
  { key: "/staffs", icon: <UserOutlined />, label: "Nhân viên" },
  { key: "/brands", icon: <SiBrandfolder />, label: "Thương hiệu" },
  { key: "/categories", icon: <TbCategoryPlus />, label: "Danh mục" },
  { key: "/sizes", icon: <FaTape />, label: "Kích thước" },
  { key: "/products", icon: <AiFillProduct />, label: "Sản phẩm" },
  { key: "/orders", icon: <CiReceipt />, label: "Đơn đặt hàng" },
  { key: "/imports", icon: <CiSaveDown1 />, label: "Phiếu nhập hàng" },
  // { key: "/comments", icon: <UserOutlined />, label: "Bình luận" },
];
export const publicRoutes = [{ path: "/", component: Login, Layout: null }];

export const privateRoutes = [
  { path: "/home", component: Home },
  { path: "/users", component: Users },
  { path: "/staffs", component: Users },
  { path: "/products", component: Products },
  { path: "/add-products", component: ProductAdd },
  { path: "/product-detail/:id", component: ProductDetail },
  { path: "/brands", component: Brands },
  { path: "/categories", component: Category },
  { path: "/sizes", component: Sizes },
  { path: "/orders", component: Orders },
  { path: "/order-detail/:id", component: OrderDetail },
  { path: "/imports", component: Imports },
  { path: "/add-imports", component: ImportAdd },
  { path: "/import-detail/:id", component: ImportDetail },
  { path: "/comments", component: Users },
];

export const generatePublicRoutes = (isAuthenticated) => {
  return publicRoutes.map((route, index) => {
    const Page = route.component;
    let Layout = DefaultLayout;

    if (route.Layout) {
      Layout = route.Layout;
    } else if (route.Layout === null) {
      Layout = Fragment;
    }
    if (isAuthenticated && route.path === "/") {
      return (
        <Route
          key={index}
          path={route.path}
          element={<Navigate to="/home" />}
        />
      );
    }
    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    );
  });
};

export const generatePrivateRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return privateRoutes.map((route, index) => {
      const Page = route.component;
      let Layout = DefaultLayout;

      if (route.Layout) {
        Layout = route.Layout;
      } else if (route.Layout === null) {
        Layout = Fragment;
      }
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <Layout>
              <Page />
            </Layout>
          }
        />
      );
    });
  }
};
