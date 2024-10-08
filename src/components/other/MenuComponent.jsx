import React from "react";
import { Menu } from "antd";

import {
  FileOutlined,
  FilterOutlined,
  PieChartOutlined,
  ShoppingFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const items = [
  {
    key: "Dashboard",
    icon: <PieChartOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
  },
  {
    key: "Thương hiệu",
    icon: <ShoppingFilled />,
    label: <Link to="/brand">Thương hiệu</Link>,
  },
  {
    key: "Danh mục sản phẩm",
    icon: <FilterOutlined />,
    label: <Link to="/category">Danh mục sản phẩm</Link>,
    // children: [
    //   {
    //     key: "9",
    //     label: "Option 9",
    //   },
    //   {
    //     key: "10",
    //     label: "Option 10",
    //   },
    //   {
    //     key: "sub3",
    //     label: "Submenu",
    //     children: [
    //       {
    //         key: "11",
    //         label: "Option 11",
    //       },
    //       {
    //         key: "12",
    //         label: "Option 12",
    //       },
    //     ],
    //   },
    // ],
  },
  {
    key: "Sản phẩm",
    icon: <FilterOutlined />,
    label: <Link to="/product">Sản phẩm</Link>,
  },
  {
    key: "Người dùng",
    icon: <UserOutlined />,
    label: <Link to="/user">Người dùng</Link>,
  },
  {
    key: "Nhân viên",
    icon: <TeamOutlined />,
    label: <Link to="/staff">Nhân viên</Link>,
  },
  {
    key: "Files",
    icon: <FileOutlined />,
    label: <Link>Khác</Link>,
  },
];

const MenuComponent = () => {
  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={["1"]}
      mode="inline"
      items={items}
    />
  );
};

export default MenuComponent;
