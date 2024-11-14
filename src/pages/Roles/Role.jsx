import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Select,
  Table,
} from "antd";
import { EyeTwoTone, HomeTwoTone, PlusOutlined } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { formatDateTime } from "../../services/commonService";
import UserService from "../../services/UserService";
import { useSearchParams } from "react-router-dom";

const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Quyền người dùng",
  },
];

const Roles = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: "Thực hiện",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Button onClick={() => handleOpenModal(record)}>
            <EyeTwoTone />
          </Button>
        </Flex>
      ),
    },
  ];

  const handleOpenModal = (record) => {
    // console.log(record);
    setEditingUser(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      // console.log("user", values);
      const user = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        roles: values.roles ? values.roles : ["User"],
      };
      const response = await UserService.create(user);
      message.success("User created successfully!");

      setData((prevData) => [...prevData, response.data]);
      form.resetFields();
      handleCloseModal();
    } catch (error) {
      message.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const user = await UserService.update(
        editingUser.id,
        form.getFieldsValue()
      );
      // console.log("user", user);
      message.success("User updated successfully!");

      setData((prevData) =>
        prevData.map((item) => (item.id === user.data.id ? user.data : item))
      );
      form.resetFields();
      handleCloseModal();
    } catch (error) {
      message.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (key) => key && key !== search && setSearch(key);

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await UserService.getAll(
          currentPage,
          currentPageSize,
          search,
          role
        );

        setData(res.data?.items);
        setTotalItems(res.data?.totalItems);
      } catch (error) {
        setSearch("");
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentPageSize, search, role]);

  return (
    <>
      <Modal
        title={
          editingUser ? "Cập nhật thông tin người dùng" : "Thêm người dùng"
        }
        open={open}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={editingUser ? handleUpdate : () => form.submit()}
          >
            {editingUser ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="addUser"
          onFinish={handleAdd}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={editingUser}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Vui lòng nhập email",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/,
                message:
                  "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quyền"
            name="roles"
            rules={[{ required: true, message: "Vui lòng chọn quyền" }]}
          >
            <Select
              mode="multiple"
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Staff", value: "Staff" },
                { label: "Inventorier", value: "Inventorier" },
                { label: "Manage", value: "Manage" },
                { label: "User", value: "User" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center">
            <Input.Search
              loading={searchLoading}
              className="w-1/2"
              size="large"
              allowClear
              onSearch={(key) => handleSearch(key)}
              onChange={(e) => e.target.value === "" && setSearch("")}
              placeholder="Nhập từ khóa cần tìm"
            />
            <Select
              size="large"
              showSearch
              className="w-1/3"
              placeholder="Search to Select"
              optionFilterProp="label"
              defaultValue="Admin"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onChange={(value) => setRole(value)}
              options={[
                {
                  value: "Admin",
                  label: "Admin",
                },
                {
                  value: "Inventorier",
                  label: "Inventorier",
                },
                {
                  value: "Staff",
                  label: "Staff",
                },
                {
                  value: "Manage",
                  label: "Manage",
                },
                {
                  value: "User",
                  label: "User",
                },
              ]}
            />
            <div>
              <Button size="large" type="primary" onClick={handleOpenModal}>
                <PlusOutlined /> Thêm người dùng
              </Button>
            </div>
          </div>

          <Table
            pagination={false}
            loading={isLoading}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
            className="overflow-x-auto"
          />
          <Pagination
            align="end"
            hideOnSinglePage
            showSizeChanger
            current={currentPage}
            pageSize={currentPageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) => {
              setCurrentPage(newPage);
              setCurrentPageSize(newPageSize);
              setSearchParams(`page=${newPage}`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Roles;