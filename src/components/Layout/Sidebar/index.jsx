import React, { useEffect, useLayoutEffect, useState } from "react";

import { Menu, message } from "antd";
import Sider from "antd/es/layout/Sider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  navigateInventorier,
  navigateItems,
  navigateManager,
  navigateStaff,
} from "../../../routes";
import authService from "../../../services/authService";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [navItems, setNaviItems] = useState(navigateItems);
  const location = useLocation();
  const [roles, setRoles] = useState([]);

  const regex = location.pathname.match(/^\/[^/]+/)?.at(0) ?? "/";
  const [navSelected, setNavSelected] = useState(regex);

  const handleMenuClick = ({ key }) => navigate(key);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authService.getRole();
        setRoles(res || []);
      } catch (error) {
        message.error("Lỗi");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    if (roles.includes("Admin")) {
      setNaviItems(navigateItems);
    } else if (roles.includes("Inventorier")) {
      setNaviItems(navigateInventorier);
    } else if (roles.includes("Manager")) {
      setNaviItems(navigateManager);
    } else if (roles.includes("Staff")) {
      setNaviItems(navigateStaff);
    }

    setNavSelected(regex);
  }, [regex, roles]);

  return (
    <>
      <Sider
        className="h-screen top-0"
        collapsible
        breakpoint="md"
        onBreakpoint={() => setCollapsed(true)}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "sticky" }}
      >
        <div>
          <Link to="/home">
            <img src="/logo.png" alt="logo" className="w-52 mx-auto" />
          </Link>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[navSelected]}
          selectedKeys={navSelected}
          mode="inline"
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </>
  );
};

export default Sidebar;
