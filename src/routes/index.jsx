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
import {
  DollarOutlined,
  PayCircleFilled,
  PieChartOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { TbCategoryPlus } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import Sizes from "../pages/Sizes/Sizes";
import Orders from "../pages/Orders/Orders";
import { CiReceipt, CiSaveDown1, CiSaveDown2 } from "react-icons/ci";
import OrderDetail from "../pages/Orders/OrderDetail";
import Imports from "../pages/Imports";
import ImportAdd from "../pages/Imports/ImportAdd";
import { FaBagShopping, FaTape } from "react-icons/fa6";
import Loges from "../pages/Loges";
import Review from "../pages/Reviews/Review";
import Roles from "../pages/Roles/Role";
import Payments from "../pages/Payments/Payments";

export const navigateItems = [
  { key: "/home", icon: <PieChartOutlined />, label: "Thống kê" },
  {
    key: "role",
    icon: <UserOutlined />,
    label: "Người dùng",
    children: [
      { key: "/users", icon: <UserOutlined />, label: "Khách hàng" },
      { key: "/roles", icon: <TeamOutlined />, label: "Nhân viên" },
    ],
  },
  {
    key: "product",
    icon: <AiFillProduct />,
    label: "Sản phẩm",
    children: [
      { key: "/brands", icon: <FaBagShopping />, label: "Thương hiệu" },
      { key: "/categories", icon: <TbCategoryPlus />, label: "Danh mục" },
      { key: "/sizes", icon: <FaTape />, label: "Kích thước" },
      { key: "/products", icon: <AiFillProduct />, label: "Sản phẩm" },
      { key: "/reviews", icon: <StarOutlined />, label: "Đánh giá" },
    ],
  },
  { key: "/payments", icon: <DollarOutlined />, label: "Thanh toán" },
  { key: "/orders", icon: <CiReceipt />, label: "Đơn đặt hàng" },
  {
    key: "import",
    icon: <CiSaveDown1 />,
    label: "Phiếu nhập",
    children: [
      { key: "/imports", icon: <CiSaveDown1 />, label: "Phiếu nhập hàng" },
      { key: "/loges", icon: <CiSaveDown2 />, label: "Lịch sử" },
    ],
  },
];

export const navigateInventorier = [
  { key: "/home", icon: <PieChartOutlined />, label: "Thống kê" },
  { key: "/brands", icon: <FaBagShopping />, label: "Thương hiệu" },
  { key: "/categories", icon: <TbCategoryPlus />, label: "Danh mục" },
  { key: "/sizes", icon: <FaTape />, label: "Kích thước" },
  { key: "/products", icon: <AiFillProduct />, label: "Sản phẩm" },
  { key: "/imports", icon: <CiSaveDown1 />, label: "Phiếu nhập hàng" },
  { key: "/loges", icon: <CiSaveDown2 />, label: "Lịch sử" },
];

export const navigateManager = [
  { key: "/home", icon: <PieChartOutlined />, label: "Thống kê" },
  { key: "/users", icon: <UserOutlined />, label: "Khách hàng" },
  { key: "/orders", icon: <CiReceipt />, label: "Đơn đặt hàng" },
];

export const navigateStaff = [
  { key: "/home", icon: <PieChartOutlined />, label: "Thống kê" },
  { key: "/orders", icon: <CiReceipt />, label: "Đơn đặt hàng" },
  { key: "/reviews", icon: <StarOutlined />, label: "Đánh giá" },
];

export const publicRoutes = [{ path: "/", component: Login, Layout: null }];

export const privateRoutes = [
  { path: "/home", component: Home },
  { path: "/users", component: Users },
  { path: "/roles", component: Roles },
  { path: "/products", component: Products },
  { path: "/add-products", component: ProductAdd },
  { path: "/product-detail/:id", component: ProductDetail },
  { path: "/brands", component: Brands },
  { path: "/categories", component: Category },
  { path: "/sizes", component: Sizes },
  { path: "/payments", component: Payments },
  { path: "/orders", component: Orders },
  { path: "/order-detail/:id", component: OrderDetail },
  { path: "/imports", component: Imports },
  { path: "/add-imports", component: ImportAdd },
  { path: "/loges", component: Loges },
  { path: "/reviews", component: Review },
];

export const inventorierRoutes = [
  { path: "/home", component: Home },
  { path: "/brands", component: Brands },
  { path: "/categories", component: Category },
  { path: "/sizes", component: Sizes },
  { path: "/products", component: Products },
  { path: "/add-products", component: ProductAdd },
  { path: "/product-detail/:id", component: ProductDetail },
  { path: "/imports", component: Imports },
  { path: "/add-imports", component: ImportAdd },
  { path: "/loges", component: Loges },
];

export const managerRoutes = [
  { path: "/home", component: Home },
  { path: "/users", component: Users },
  { path: "/payments", component: Payments },
  { path: "/orders", component: Orders },
  { path: "/order-detail/:id", component: OrderDetail },
];

export const staffRoutes = [
  { path: "/home", component: Home },
  { path: "/orders", component: Orders },
  { path: "/order-detail/:id", component: OrderDetail },
  { path: "/reviews", component: Review },
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

export const generateInventorierRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return inventorierRoutes.map((route, index) => {
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

export const generateManagerRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return managerRoutes.map((route, index) => {
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

export const generateStaffRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return staffRoutes.map((route, index) => {
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
