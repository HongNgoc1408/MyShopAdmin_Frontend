import { Button, Card, Form, Input, notification, Spin } from "antd";
import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import authService from "../../services/authService";
import { showError } from "../../services/commonService";
import authAction from "../../services/AuthAction";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Footer } from "antd/es/layout/layout";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = form.getFieldsValue();
      const res = await authService.login(data);

      if (res.data?.roles?.includes("Admin")) {
        dispatch(authAction.LOGIN(res.data?.roles));
        notification.success({
          message: "Đăng nhập thành công.",
          placement: "top",
        });
        navigate("/home");
      } else if (res.data?.roles?.includes("Inventorier")) {
        dispatch(authAction.LOGIN(res.data?.roles));
        notification.success({
          message: "Đăng nhập thành công.",
          placement: "top",
        });
        navigate("/home");
      } else if (res.data?.roles?.includes("Manager")) {
        dispatch(authAction.LOGIN(res.data?.roles));
        notification.success({
          message: "Đăng nhập thành công.",
          placement: "top",
        });
        navigate("/home");
      } else if (res.data?.roles?.includes("Staff")) {
        dispatch(authAction.LOGIN(res.data?.roles));
        notification.success({
          message: "Đăng nhập thành công.",
          placement: "top",
        });
        navigate("/home");
      } else {
        notification.error({
          message: "Không có quyền truy cập",
          placement: "top",
        });
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 py-28">
        <div className="py-12 xl:px-20 px-4">
          <Form
            form={form}
            initialValues={{
              username: "",
              password: "",
            }}
            onFinish={handleSubmit}
            className="max-w-[555px] h-auto bg-white m-auto px-14 py-10 rounded-md"
          >
            <img src="logoHCN.png" alt="logo" className="w-50 mx-auto" />
            {/* <h3 className="title text-center">Đăng nhập</h3> */}
            <div className="w-full flex flex-col">
              <Form.Item
                name="username"
                hasFeedback
                rules={[
                  {
                    type: "email",
                    message: "Email không đúng định dạng",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                ]}
              >
                <input
                  autoComplete="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-base text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                ]}
              >
                <div className="relative">
                  <span
                    className="z-10 absolute top-6 right-5"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                  >
                    {isShowPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>

                  <input
                    autoComplete="new-password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className="w-full text-base text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  />
                </div>
              </Form.Item>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="w-full flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked
                  readOnly
                />
                <p className="text-base">Ghi nhớ mật khẩu</p>
              </div>
              <div>
                <Link
                  to="/reset-password"
                  className="text-base font-medium whitespace-nowrap cursor-pointer underline underline-offset-2"
                >
                  Quên mật khẩu ?
                </Link>
              </div>
            </div>
            <div className="w-full flex flex-col my-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-dark-button text-base py-2 rounded-md ${
                  loading ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
              >
                <span className="relative z-10">
                  {loading ? <Spin /> : "Đăng nhập"}
                </span>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
