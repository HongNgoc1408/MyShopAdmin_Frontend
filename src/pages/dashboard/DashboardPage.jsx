import React from "react";
import { Layout, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import SiderComponent from "../../components/other/SiderComponent";
import HeaderComponent from "../../components/other/HeaderComponent";
import FooterComponent from "../../components/other/FooterComponent";

const DashboardPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SiderComponent />
        <Layout>
          <HeaderComponent />
          <Content
            style={{
              margin: "16px",
            }}
          >
            {/* <BreadcrumbComponent /> */}
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              DashboardPage
            </div>
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </>
  );
};
export default DashboardPage;
