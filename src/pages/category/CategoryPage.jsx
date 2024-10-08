import { Layout } from "antd";
import React from "react";
import SiderComponent from "../../components/other/SiderComponent";
import HeaderComponent from "../../components/other/HeaderComponent";
import { Content } from "antd/es/layout/layout";
import TableCategoryComponent from "../../components/category/TableCategoryComponent";
import FormAddCategoryComponent from "../../components/category/FormAddCategoryComponent";
import FooterComponent from "../../components/other/FooterComponent";
import FormEditCategoryComponent from "../../components/category/FormEditCategoryComponent";

const CategoryPage = () => {
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

            <p className="title">Category Page</p>

            <div className="flex">
              <TableCategoryComponent />
              <FormAddCategoryComponent
                textButton="Add"
                titleForm="Add Category"
              />
              {/* <FormEditCategoryComponent
                textButton="Edit"
                titleForm="Edit Category"
              /> */}
            </div>
          </Content>
          <FooterComponent />
        </Layout>
      </Layout>
    </>
  );
};

export default CategoryPage;
