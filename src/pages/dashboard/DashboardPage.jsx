import React from "react";
import { Layout } from "antd";
import FooterComponent from "../../components/FooterComponent";
import HeaderComponent from "../../components/HeaderComponent";
import ContentComponent from "../../components/ContentComponent";
import SiderComponent from "../../components/SiderComponent";

const DashboardPage = () => {
  return (
    <div>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <SiderComponent />
        <Layout>
          <HeaderComponent />
          <ContentComponent />
          <FooterComponent />
        </Layout>
      </Layout>
    </div>
  );
};
export default DashboardPage;
