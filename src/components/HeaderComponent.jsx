import { Col, Row } from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Header
      style={{
        padding: 0,
        background: "#f5f5f5",
      }}
    >
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
        <Col className="gutter-row" span={18}></Col>

        <Col className="gutter-row" span={6}>
          <div className="relative flex justify-end p-2">
            <button className="realtive z-10 w-12 h-12 rounded-full overflow-hidden focus:outline-none">
              <FaBell size={24} className="text-blue-500" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="realtive z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
            >
              <img src="" alt="Avatar" />
            </button>
            <div className="p-2 md:block text-left">
              <h2 className="text-base font-semibold text-gray-800 hover:border-b-2 hover:border-b-orange-500">
                Admin
              </h2>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            {isOpen && (
              <>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-full w-full fixed inset-0 cursor-default"
                ></button>
                <div className="absolute w-28 bg-white rounded-lg shadow-lg mt-12">
                  <Link href="#" className="block px-4 hover:#1677ff">
                    Account
                  </Link>
                  <Link href="#" className="block px-4 hover:#1677ff">
                    Support
                  </Link>
                  <Link
                    // onClick={handleLogout}1677ff
                    href="#"
                    className="block px-4 hover:#1677ff"
                  >
                    Logout
                  </Link>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;
