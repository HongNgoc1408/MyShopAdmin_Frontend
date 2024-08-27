import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import BreadcrumbComponent from "./BreadcrumbComponent";

const ContentComponent = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content
      style={{
        margin: "0 16px",
      }}
    >
      <BreadcrumbComponent />
      <div
        style={{
          padding: 24,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        Bill is a cat.
      </div>
    </Content>
  );
};

export default ContentComponent;
