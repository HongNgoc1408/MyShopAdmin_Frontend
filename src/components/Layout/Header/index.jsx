import { Avatar, Badge, Flex, Popconfirm, Typography } from "antd";
import React, { useEffect, useState } from "react";
import {
  MessageOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../App";
import authAction from "../../../services/AuthAction";
import authService from "../../../services/authService";

const Header = () => {
  const { state, dispatch } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    user ? setUsername(user.name) : setUsername("");
  }, [state.isAuthenticated]);

  const handleLogout = () => {
    dispatch(authAction.LOGOUT);
    authService.logout();
    navigate("/");
  };

  return (
    <>
      <Flex className="bg-white p-3 text-center justify-between sticky top-0 z-30">
        {state.isAuthenticated && (
          <Typography.Title level={4} type="secondary">
            {username}
          </Typography.Title>
        )}
        <Flex className=" items-center space-x-3  text-blue-600">
          <Badge count={1}>
            <MessageOutlined className="p-2 border-2 rounded-md text-lg hover:bg-gray-300" />
          </Badge>
          <Badge dot>
            <NotificationOutlined className="p-2 border-2 rounded-md text-lg  hover:bg-gray-300" />
          </Badge>
          <Popconfirm
            title="Bạn có chắc muốn đăng xuất?"
            onConfirm={handleLogout}
          >
            <Avatar
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              className="h-10 w-10 hover:ring-4 user cursor-pointer relative ring-orange-600/30 rounded-full bg-cover bg-center"
            />
          </Popconfirm>
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
