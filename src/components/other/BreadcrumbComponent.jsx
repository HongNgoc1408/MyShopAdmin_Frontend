import { Breadcrumb } from "antd";
import React from "react";

const BreadcrumbComponent = () => {
  return (
    <Breadcrumb
      style={{
        margin: "16px 0",
      }}
    >
      <Breadcrumb.Item>User</Breadcrumb.Item>
      <Breadcrumb.Item>Bill</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
