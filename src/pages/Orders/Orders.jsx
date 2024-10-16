import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Input,
  notification,
  Pagination,
  Popconfirm,
  Switch,
  Table,
  Tag,
} from "antd";
import {
  formatDateTime,
  formatVND,
  showError,
  toImageLink,
  toTextValue,
} from "../../services/commonService";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteTwoTone,
  EyeTwoTone,
  HomeTwoTone,
} from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import OrderService from "../../services/OrderService";

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const breadcrumb = [
    {
      path: "/",
      title: <HomeTwoTone />,
    },
    {
      title: "Đơn hàng",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span className="font-semibold">{value}</span>,
    },

    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Phí vận chuyển",
      dataIndex: "shippingCost",
      render: (value) => formatVND(value),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      render: (value) => formatVND(value),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "amountPaid",
      render: (value) => formatVND(value),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "orderStatus",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (orderStatus) => (
        <>
          <Tag
            color={
              orderStatus === 0
                ? "geekblue"
                : orderStatus === 1
                ? "green"
                : "red"
            }
            key={orderStatus}
          >
            {orderStatus === 0
              ? "Đang chờ"
              : orderStatus === 1
              ? "Đã thanh toán"
              : "Đã hủy"}
          </Tag>
        </>
      ),
    },
    {
      title: "Thực hiện",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Link to={`/order-detail/${record.id}`}>
            <Button>
              <EyeTwoTone />
            </Button>
          </Link>
          <Popconfirm
            title={`Xác nhận xóa ${record.id}`}
            onConfirm={() => handleDelete(record.id)}
            loading={loadingDelete}
          >
            <Button>
              <DeleteTwoTone />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const handleSearch = (key) => key && key !== search && setSearch(key);

  useEffect(() => {
    const fetchData = async () => {
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await OrderService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        console.log(res.data?.items);

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
  }, [currentPage, currentPageSize, search]);

  const handleChangeEnable = async (id, value) => {
    try {
      const data = { enable: value };
      await OrderService.updateEnable(id, data);
      notification.success({ message: "cập nhật thành công." });
    } catch (error) {
      showError(error);
    }
  };

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await OrderService.remove(id);
      const newData = data.filter((item) => !(item.id === id));
      console.log(newData);
      setData(newData);
      notification.success({
        message: "Xóa thành công",
      });
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
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
            placeholder="Tìm kiếm"
          />
        </div>
        <Table
          pagination={false}
          showSorterTooltip={false}
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
            setSearchParams(`page=${newPage}`);
          }}
        />
      </div>
    </div>
  );
};

export default Orders;
