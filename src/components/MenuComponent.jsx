import { Menu } from "antd";
import React from "react";
import {
  FileOutlined,
  FilterOutlined,
  PieChartOutlined,
  ProductOutlined,
  ShoppingFilled,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  getItem("Thương hiệu", "2", <ShoppingFilled />, [
    getItem("Zara", "3"),
    getItem("Gucci", "4"),
    getItem("Chanel", "5"),
  ]),
  getItem("Danh mục sản phẩm", "6", <FilterOutlined />, [
    getItem("Áo", "7"),
    getItem("Quần", "8"),
  ]),
  getItem("Sản phẩm", "9", <ProductOutlined />),
  getItem("Người dùng", "sub1", <UserOutlined />, [getItem("Tài khoản", "10")]),

  getItem("Nhân viên", "sub2", <TeamOutlined />, [
    getItem("Tài khoản", "11"),
    getItem("Team 2", "12"),
  ]),
  getItem("Files", "13", <FileOutlined />),
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
