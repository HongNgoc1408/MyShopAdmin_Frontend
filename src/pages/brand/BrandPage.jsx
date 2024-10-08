import { Layout } from "antd";
import React from "react";
import { Content } from "antd/es/layout/layout";
import TableBrandComponent from "../../components/brand/TableBrandComponent";
import FormAddBrandComponent from "../../components/brand/FormAddBrandComponent";
import HeaderComponent from "../../components/other/HeaderComponent";
import SiderComponent from "../../components/other/SiderComponent";
import FooterComponent from "../../components/other/FooterComponent";

const BrandPage = () => {
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

            <p className="title">Brand Page</p>

            <div className="flex">
              <TableBrandComponent />
              <FormAddBrandComponent textButton="Add" titleForm="Add Brand" />
              {/* <FormEditBrandComponent
                textButton="Edit"
                titleForm="Edit Brand"
              /> */}
            </div>
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </>
  );
};

export default BrandPage;
