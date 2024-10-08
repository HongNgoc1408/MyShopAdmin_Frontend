import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import MenuComponent from "./MenuComponent";
import LogoComponent from "./LogoComponent";

const SiderComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <LogoComponent />
      <MenuComponent />
    </Sider>
  );
};

export default SiderComponent;
