import { Button, Form, Input, notification, Spin } from "antd";
import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import authService from "../../services/authService";
import { showError } from "../../services/commonService";
import authAction from "../../services/AuthAction";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = form.getFieldsValue();
      const res = await authService.login(data);
      if (res.data?.roles?.includes("Admin")) {
        dispatch(authAction.LOGIN(res.data?.roles));
        notification.success({ message: "Đăng nhập thành công." });
        navigate("/home");
      } else {
        notification.error({ message: "Không có quyền truy cập" });
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-200">
      <div className="w-11/12 md:w-3/5 lg:w-2/5 space-y-4 px-10 py-14 bg-white shadow-lg rounded-lg overflow-hidden">
        <>
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">
            <img src="/logo.png" alt="logo" className="w-80 mx-auto" />
          </h2>
          <Form form={form} disabled={loading} onFinish={handleSubmit}>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-300 mx-1" />}
                placeholder="Email"
                size="large"
                className="text-gray-600"
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
              <Input.Password
                size="large"
                placeholder="Mật khẩu"
                prefix={<LockOutlined className="text-gray-300 mx-1" />}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full px-4  text-white bg-blue-700 rounded-3xl hover:bg-blue-600 "
            >
              {loading ? <Spin /> : "Đăng nhập"}
            </Button>
          </Form>
        </>
      </div>
    </div>
  );
};

export default Login;
