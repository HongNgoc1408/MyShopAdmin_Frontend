// import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useLayoutEffect, useState } from "react";

import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateItems } from "../../../routes";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [navItems, setNaviItems] = useState(navigateItems);
  const location = useLocation();

  const regex = location.pathname.match(/^\/[^/]+/)?.at(0) ?? "/";
  const [navSelected, setNavSelected] = useState(regex);

  const handleMenuClick = ({ key }) => navigate(key);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    setNaviItems(navigateItems);
    setNavSelected(regex);
  }, [regex]);

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
