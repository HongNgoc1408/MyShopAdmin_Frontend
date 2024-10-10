import React, { useEffect, useState } from "react";
import { Input, Pagination, Table } from "antd";
import { HomeTwoTone } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { formatDateTime, showError } from "../../services/commonService";
import userService from "../../services/UserService";

const UserBot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Người dùng",
    },
  ];

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
      title: "Quyền",
      dataIndex: "roles",
      render: (roles) => roles.join(", "),
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
  ];

  const handleSearch = (key) => key && key !== search && setSearch(key);

  useEffect(() => {
    search ? setSearchLoading(true) : setIsLoading(true);
    userService
      .getAllUser(currentPage, currentPageSize, search)
      .then((res) => {
        // console.log(res.data)
        setData(res.data.items);
        setTotalItems(res.data?.totalItems);
      })
      .catch((err) => {
        showError(err);
      })
      .finally(() => {
        setSearchLoading(false);
        setIsLoading(false);
      });
  }, [currentPage, currentPageSize, search]);

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
        <Input.Search
          loading={searchLoading}
          className="w-1/3"
          size="large"
          allowClear
          onSearch={(key) => handleSearch(key)}
          onChange={(e) => e.target.value === "" && setSearch("")}
        />

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
          defaultCurrent={currentPage}
          defaultPageSize={currentPageSize}
          total={totalItems}
          onChange={(newPage, newPageSize) => {
            setCurrentPage(newPage);
            setCurrentPageSize(newPageSize);
          }}
        />
      </div>
    </div>
  );
};

export default UserBot;
