import React, { useEffect, useState } from "react";
import { Input, Pagination, Select, Table } from "antd";
import { HomeTwoTone } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { formatDateTime } from "../../services/commonService";
import UserService from "../../services/UserService";
import { useSearchParams } from "react-router-dom";

const Roles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState();

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Quyền người dùng",
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
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
        <div className="space-x-4">
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
            ]}
          />
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
  );
};

export default Roles;
