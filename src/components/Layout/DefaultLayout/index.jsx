import React from "react";
import Sidebar from "../Sidebar";
import { App, ConfigProvider, Layout } from "antd";
import Header from "../Header";
import Footer from "../Footer";
import { Content } from "antd/es/layout/layout";
import viVN from "antd/locale/vi_VN";

const DefaultLayout = ({ children }) => {
  return (
    <ConfigProvider locale={viVN}>
      <App notification={{ duration: 3, showProgress: true }}>
        <Layout>
          <Sidebar />
          <Layout>
            <Header />
            <Content className="p-4">{children}</Content>
            <Footer />
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
};

export default DefaultLayout;
