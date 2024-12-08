import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Tag,
} from "antd";
import {
  formatDateTime,
  formatVND,
  showError,
  statusOrders,
} from "../../services/commonService";
import { Link, useSearchParams } from "react-router-dom";
import { DeleteTwoTone, EyeTwoTone, HomeTwoTone } from "@ant-design/icons";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import OrderService from "../../services/OrderService";
import moment from "moment";

const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Đơn hàng",
  },
];

const Orders = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(searchParams.get("page") ?? 1);
  const [currentPageSize, setCurrentPageSize] = useState();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedstatus, setSelectedStatus] = useState();
  // const [paymentMethod, setPaymentMethod] = useState("");

  const showModal = (id) => {
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      if (selectedOrderId) {
        const value = await form.validateFields();
        const res = await OrderService.shipping(selectedOrderId, value);

        setData(res.data);
        // window.location.reload();
        notification.success({
          message: "Cập nhật thành công.",
          placement: "top",
        });
      }

      setIsModalOpen(false);
    } catch (error) {
      // console.log("error", error);
      showError(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSearch = (value) => value && value !== search && setSearch(value);

  // console.log("1", search);

  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) {
        form.resetFields();
      }
      try {
        search ? setSearchLoading(true) : setIsLoading(true);
        const res = await OrderService.getAll(
          currentPage,
          currentPageSize,
          search
        );

        // console.log(res.data?.items);

        setData(res.data?.items);
        setTotalItems(res.data?.totalItems);
        setCurrentPage(searchParams.get("page") ?? 1);
        setSelectedStatus(5);
      } catch (error) {
        setSearch("");
      } finally {
        setIsLoading(false);
        setSearchLoading(false);
      }
    };
    fetchData();
  }, [currentPage, currentPageSize, search, searchParams, isModalOpen, form]);

  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      await OrderService.remove(id);
      const newData = data.filter((item) => !(item.id === id));
      // console.log(newData);

      setData(newData);
      notification.success({
        message: "Xóa thành công",
        placement: "top",
      });
    } catch (error) {
      showError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await OrderService.updateStatus(id, { orderStatus: data });

      setData(form.resetFields());
      notification.success({
        message: "Cập nhật trạng thái thành công",
        placement: "top",
      });
    } catch (error) {
      showError(error);
    }
  };

  const onChange = async (value) => {
    if (value !== 5) {
      const res = await OrderService.getStatus(
        value,
        currentPage,
        currentPageSize,
        search
      );

      setData(res.data?.items);
      setSelectedStatus(value);
    } else {
      const res = await OrderService.getAll(
        currentPage,
        currentPageSize,
        search
      );

      // console.log(res.data?.items);

      setData(res.data?.items);
      setTotalItems(res.data?.totalItems);
      setCurrentPage(searchParams.get("page") ?? 1);
      setSelectedStatus(value);
    }
    setSelectedStatus();
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (value) => (
        <Link to={`/order-detail/${value}`} className="font-semibold">
          {value}
        </Link>
      ),
    },
    {
      title: "Mã vận đơn",
      dataIndex: "shippingCode",
      filters: [
        { text: "Có mã", value: "hasValue" },
        { text: "Chưa có", value: "noValue" },
      ],
      onFilter: (value, record) =>
        value === "hasValue"
          ? record.shippingCode !== null
          : record.shippingCode === null,
      render: (value) =>
        value === null ? (
          <Tag color="red">Chưa có</Tag>
        ) : (
          <Tag color="blue">{value}</Tag>
        ),
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      render: (value) => <p style={{ width: 100 }}>{value}</p>,
    },
    {
      title: "Địa chỉ nhận",
      dataIndex: "deliveryAddress",
      sorter: (a, b) => a.deliveryAddress - b.deliveryAddress,
      render: (value) => <p style={{ width: 200 }}>{value}</p>,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      render: (value) => formatDateTime(value),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      filters: [
        { text: "Hôm nay", value: "today" },
        { text: "Tháng này", value: "thisMonth" },
        { text: "Năm nay", value: "thisYear" },
      ],
      onFilter: (value, record) => {
        const orderDate = moment(record.orderDate); // Chuyển đổi sang Moment
        if (value === "today") {
          return orderDate.isSame(moment(), "day"); // Cùng ngày
        }
        if (value === "thisMonth") {
          return orderDate.isSame(moment(), "month"); // Cùng tháng
        }
        if (value === "thisYear") {
          return orderDate.isSame(moment(), "year"); // Cùng tuần
        }
        return false;
      },
    },
    {
      title: "Ngày dự kiến",
      dataIndex: "expected_delivery_time",
      render: (value) =>
        value === null ? <Tag color="red">Chưa có</Tag> : formatDateTime(value),
    },
    {
      title: "Ngày nhận hàng",
      dataIndex: "receivedDate",
      render: (value) =>
        value === "0001-01-01T00:00:00" ? (
          <Tag color="red">Chưa nhận</Tag>
        ) : (
          formatDateTime(value)
        ),

      sorter: (a, b) => new Date(a.receivedDate) - new Date(b.receivedDate),
      filters: [
        { text: "Hôm nay", value: "today" },
        { text: "Tháng này", value: "thisMonth" },
        { text: "Năm nay", value: "thisYear" },
      ],
      onFilter: (value, record) => {
        const receivedDate = moment(record.receivedDate);
        if (value === "today") {
          return receivedDate.isSame(moment(), "day");
        }
        if (value === "thisMonth") {
          return receivedDate.isSame(moment(), "month");
        }
        if (value === "thisYear") {
          return receivedDate.isSame(moment(), "year");
        }
        return false;
      },
    },
    {
      title: "Phí vận chuyển",
      dataIndex: "shippingCost",
      sorter: (a, b) => a.shippingCost - b.shippingCost,
      render: (value) => formatVND(value),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      render: (value) => formatVND(value),
    },
    {
      title: "Tiền thanh toán",
      dataIndex: "amountPaid",
      sorter: (a, b) => a.amountPaid - b.amountPaid,
      render: (value) => formatVND(value),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethodName",
      align: "center",
      filters: [
        { text: "COD", value: "COD" },
        { text: "VNPay", value: "VNPay" },
      ],
      onFilter: (value, record) => record.paymentMethodName === value,
      render: (value) =>
        value === "COD" ? (
          <Tag color="green">{value}</Tag>
        ) : (
          <Tag color="green-inverse">{value}</Tag>
        ),
    },
    {
      title: "Trạng thái đánh giá",
      dataIndex: "reviewed",
      align: "center",
      filters: [
        { text: "Đã đánh giá", value: true },
        { text: "Chưa đánh giá", value: false },
      ],
      onFilter: (value, record) => record.reviewed === value,
      render: (value) =>
        value ? (
          <Tag color="blue">Đã đánh giá</Tag>
        ) : (
          <Tag color="red">Chưa đánh giá</Tag>
        ),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (value, record) => {
        let options = [];
        if (value === 0 || value === 1) {
          options = statusOrders.filter((item) => [1, 4].includes(item.value));
        } else if (value === 2) {
          options = statusOrders.filter((item) => item.value === 3);
        } else if (value === 1) {
          options = statusOrders.filter((item) => item.value === 4);
        } else {
          options = [];
        }

        return (
          <>
            <Select
              showSearch
              optionFilterProp="label"
              style={{ width: 150 }}
              value={
                value === 2
                  ? "Đang vận chuyển"
                  : statusOrders.find((s) => s.value === value)?.label
              }
              onChange={(newValue) => handleUpdate(record.id, newValue)}
              options={options.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              disabled={value === 3 || value === 4} // Vô hiệu hóa khi đã nhận và hủy
            />
          </>
        );
      },
    },
    {
      title: "Thực hiện",
      align: "center",
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <>
            <Button
              className={`${record.orderStatus === 1 ? "" : "hidden"} `}
              onClick={() => showModal(record.id)}
            >
              Vận chuyển
            </Button>
            <Modal
              title="Thông tin đơn hàng vận chuyển"
              open={isModalOpen}
              onOk={() => handleOk()}
              onCancel={handleCancel}
            >
              <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
              >
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <Form.Item
                      name="weight"
                      label="Cân nặng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập cân nặng",
                        },
                      ]}
                    >
                      <InputNumber
                        // formatter={(value) => `${value}gram`}
                        // parser={(value) => value?.replace("gram", "")}
                        className="w-full"
                        placeholder="Weight (gram)"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-1/2">
                    <Form.Item
                      name="length"
                      label="Chiều dài"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập chiều dài",
                        },
                      ]}
                    >
                      <InputNumber
                        // formatter={(value) => `${value}cm`}
                        // parser={(value) => value?.replace("cm", "")}
                        className="w-full"
                        placeholder="Length (cm)"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <Form.Item
                      name="width"
                      label="Chiều rộng"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập chiều rộng",
                        },
                      ]}
                    >
                      <InputNumber
                        // formatter={(value) => `${value}cm`}
                        // parser={(value) => value?.replace("cm", "")}
                        className="w-full"
                        placeholder="Width (cm)"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-1/2">
                    <Form.Item
                      name="height"
                      label="Chiều cao"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập chiều cao",
                        },
                      ]}
                    >
                      <InputNumber
                        // formatter={(value) => `${value}cm`}
                        // parser={(value) => value?.replace("cm", "")}
                        className="w-full"
                        placeholder="Height (cm)"
                      />
                    </Form.Item>
                  </div>
                </div>

                <Form.Item
                  name="requiredNote"
                  label="Ghi chú"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ghi chú",
                    },
                  ]}
                >
                  <Select
                    placeholder="Ghi chú"
                    options={[
                      {
                        value: 0,
                        label: "Cho thử hàng",
                      },
                      {
                        value: 1,
                        label: "Cho xem hàng không cho thử",
                      },
                      {
                        value: 2,
                        label: "Không cho xem hàng",
                      },
                    ]}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </>
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

  const items = [
    { key: 5, value: 5, label: "Tất cả" },
    { key: 0, value: 0, label: "Đang xử lý" },
    { key: 1, value: 1, label: "Đã duyệt" },
    { key: 2, value: 2, label: "Đang vận chuyển" },
    { key: 3, value: 3, label: "Đã nhận" },
    { key: 4, value: 4, label: "Đã hủy" },
  ];

  return (
    <>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />

        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center gap-4">
            <Input.Search
              loading={searchLoading}
              className="w-1/2"
              size="large"
              allowClear
              onSearch={(key) => handleSearch(key)}
              onChange={(e) => e.target.value === "" && setSearch("")}
              placeholder="Nhập mã đơn hàng, mã vận đơn, phương thức thanh toán, tên người nhận"
            />
          </div>
          <Tabs defaultActiveKey="5" items={items} onChange={onChange} />
          <Table
            pagination={false}
            showSorterTooltip={false}
            loading={isLoading}
            columns={columns}
            dataSource={data}
            // dataSource={filteredOrders}
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
    </>
  );
};

export default Orders;
