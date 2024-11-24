import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Typography,
  Upload,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  MessageOutlined,
  NotificationOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AvatarContext, useAuth } from "../../../App";
import authAction from "../../../services/AuthAction";
import authService from "../../../services/authService";
import { showError, toImageLink } from "../../../services/commonService";
import UserService from "../../../services/UserService";
const Header = () => {
  const { state, dispatch } = useAuth();
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const { avatar, setAvatar } = useContext(AvatarContext);
  // const [avt, setAvt] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await UserService.getProfile();

        setData(data.data);
      } catch (error) {
        showError(error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleUpdateClick = () => {
    setIsAvatarModalOpen(true);
    setFileList([]);
  };

  const handleAvatarModalCancel = () => {
    setIsAvatarModalOpen(false);
    setFileList([]);
  };

  const handleAvatarUpdate = async () => {
    if (fileList.length === 0) {
      notification.error({
        message: "Vui lòng chọn ảnh.",
        placement: "top",
      });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", fileList[0].originFileObj);

    try {
      const res = await UserService.updateAvatar(formData);

      notification.success({
        message: "Cập nhật ảnh đại diện thành công.",
        placement: "top",
      });

      // setAvt(res.data.imageURL);
      setAvatar(res.data.imageURL);
      setIsAvatarModalOpen(false);
    } catch (error) {
      showError(error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    user ? setUsername(user.name) : setUsername("");
  }, [state.isAuthenticated]);

  const handleLogout = () => {
    dispatch(authAction.LOGOUT);
    authService.logout();
    navigate("/");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const items = [
    {
      key: "1",
      label: (
        <div onClick={showModal} className="cursor-pointer">
          Thông tin
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Popconfirm
          title="Bạn có chắc muốn đăng xuất?"
          onConfirm={handleLogout}
        >
          Đăng xuất
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Cập nhật thông tin"
        open={isModalOpen}
        onOk={handleUpdateClick}
        onCancel={handleCancel}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Card title="Thông tin cá nhân">
          <Form layout="vertical" form={form}>
            <div className="flex items-center justify-center">
              <Avatar src={toImageLink(avatar)} size={175} fontWeight={800} />
            </div>

            <Form.Item label="Email">
              <Input value={data.email} readOnly />
            </Form.Item>
            <Form.Item label="Họ và tên">
              <Input defaultValue={data.fullName} value={data.fullName} />
            </Form.Item>
            <Form.Item label="Số điện thoại">
              <Input defaultValue={data.phoneNumber} value={data.phoneNumber} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleUpdateClick}>
                Cập nhật
              </Button>

              <Modal
                width={200}
                centered
                title="Cập nhật ảnh"
                open={isAvatarModalOpen}
                onCancel={handleAvatarModalCancel}
                onOk={handleAvatarUpdate}
              >
                <Form.Item
                  className="mx-auto"
                  name="imageUrl"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ảnh.",
                    },
                  ]}
                >
                  <Upload
                    name="file"
                    beforeUpload={() => false}
                    listType="picture-circle"
                    fileList={fileList}
                    accept="image/png, image/gif, image/jpeg, image/svg"
                    maxCount={1}
                    onChange={handleFileChange}
                    showUploadList={{ showPreviewIcon: false }}
                  >
                    {fileList.length >= 1 ? null : (
                      <button type="button">
                        <UploadOutlined />
                        <div>Chọn ảnh</div>
                      </button>
                    )}
                  </Upload>
                </Form.Item>
              </Modal>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Flex className="bg-white p-3 text-center justify-between sticky top-0 z-30">
        {state.isAuthenticated && (
          <Typography.Title level={4} type="secondary">
            {username}
          </Typography.Title>
        )}
        <Flex className=" items-center space-x-3  text-blue-600">
          <Link to={"https://dashboard.kommunicate.io/conversations"}>
            <Badge>
              <MessageOutlined className="p-2 border-2 rounded-md text-lg hover:bg-gray-300" />
            </Badge>
          </Link>

          <Badge dot>
            <NotificationOutlined className="p-2 border-2 rounded-md text-lg  hover:bg-gray-300" />
          </Badge>

          <Dropdown menu={{ items }} placement="bottomRight">
            <Link to={"/"} className="flex text-base p-2 cursor-pointer">
              {avatar !== null ? (
                <Avatar
                  src={toImageLink(avatar) || "avatar.png"}
                  size={30}
                  fontWeight={800}
                />
              ) : (
                <Avatar src="avatar.png" size={30} fontWeight={800} />
              )}
            </Link>
          </Dropdown>
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
