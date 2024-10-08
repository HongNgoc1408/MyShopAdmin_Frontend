import { Layout } from "antd";
import React from "react";
import SiderComponent from "../../components/other/SiderComponent";
import HeaderComponent from "../../components/other/HeaderComponent";
import { Content } from "antd/es/layout/layout";
import FooterComponent from "../../components/other/FooterComponent";
import TableProductComponent from "../../components/product/TableProductComponent";
import FormAddProductComponent from "../../components/product/FormAddProductComponent";
import FormEditProductComponent from "../../components/product/FormEditProductComponent";

const ProductPage = () => {
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

            <p className="title">Product Page</p>
            {/* <TableProductComponent /> */}
            {/* <FormAddProductComponent textButton="Add" titleForm="Add Product"  /> */}
            <FormEditProductComponent
              textButton="Edit"
              titleForm="Edit Product"
            />
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </>
  );
};

export default ProductPage;
