import { Footer } from "antd/es/layout/layout";
import React from "react";

const FooterComponent = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      My Shop ©{new Date().getFullYear()} Created by Hong Ngoc
    </Footer>
  );
};

export default FooterComponent;
