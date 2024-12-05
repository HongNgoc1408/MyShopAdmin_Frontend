import React, { useEffect, useMemo, useState } from "react";
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

const breadcrumb = [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    title: "Đơn dặt hàng",
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
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedTab, setSelectedTab] = useState(6);
  const [paymentMethod, setPaymentMethod] = useState("");

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
        window.location.reload();
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

  const handleSearch = (key) => key && key !== search && setSearch(key);

  // console.log(search);

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
        //
        // console.log(res.data?.items);

        setData(res.data?.items);
        setTotalItems(res.data?.totalItems);
        setCurrentPage(searchParams.get("page") ?? 1);
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

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      render: (value) => <p className="font-semibold">{value}</p>,
    },
    {
      title: "Mã vận đơn",
      dataIndex: "shippingCode",
      sorter: (a, b) => a.shippingCode - b.shippingCode,
      render: (value) => <span>{value}</span>,
    },
    {
      title: "Người nhận",
      dataIndex: "receiver",
      sorter: (a, b) => a.receiver - b.receiver,
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
    },
    {
      title: "Ngày dự kiến",
      dataIndex: "expected_delivery_time",
      render: (value) =>
        value === "0001-01-01T00:00:00" ? (
          <Tag color="red">Chưa có</Tag>
        ) : (
          formatDateTime(value)
        ),
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
      title: "Tiền thanh toán",
      dataIndex: "amountPaid",
      render: (value) => formatVND(value),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethodName",
      align: "center",
      render: (value) => <span>{value}</span>,
    },
    {
      title: "Trạng thái đánh giá",
      dataIndex: "reviewed",
      align: "center",
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
        // Xác định các tùy chọn hiển thị dựa trên trạng thái đơn hàng
        let options = [];
        if (value === 0 || value === 1) {
          options = statusOrders.filter((item) => [1, 4].includes(item.value));
        } else if (value === 2) {
          options = statusOrders.filter((item) => item.value === 3);
        } else if (value === 1) {
          options = statusOrders.filter((item) => item.value === 4);
        } else {
          options = []; // Không hiển thị nếu đã nhận
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
    { key: 6, label: "Tất cả" },
    { key: 0, label: "Đang xử lý" },
    { key: 1, label: "Đã duyệt" },
    { key: 2, label: "Đang vận chuyển" },
    { key: 3, label: "Đã nhận" },
    { key: 4, label: "Đã hủy" },
  ];

  const filteredOrders = Array.isArray(data)
    ? data.filter((order) => {
        const matchesStatus =
          selectedTab === 6 || order.orderStatus === parseInt(selectedTab);
        const matchesPayment =
          !paymentMethod || order.paymentMethodName === paymentMethod;
        const matchesSearch = search
          ? order.id.toString().includes(search)
          : true;
        return matchesStatus && matchesPayment && matchesSearch;
      })
    : [];

  // const filteredOptions = useMemo(() => {
  //   if (value === 0 || value === 1)
  //     return statusOrders.filter((item) => [1, 4].includes(item.value));
  //   if (value === 2) return statusOrders.filter((item) => item.value === 3);
  //   if (value === 1) return statusOrders.filter((item) => item.value === 4);
  //   return [];
  // }, [value]);

  const onChange = (key) => {
    setSelectedTab(key);
  };
  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

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
              placeholder="Nhập mã đơn hàng"
            />
            <Select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              defaultValue=""
              style={{ width: 120 }}
              allowClear
              size="large"
              options={[
                { value: "", label: "Tất cả" },
                { value: "VNPay", label: "VNPay" },
                { value: "COD", label: "COD" },
              ]}
              placeholder="Chọn"
            />
          </div>
          <Tabs defaultActiveKey="6" items={items} onChange={onChange} />
          <Table
            pagination={false}
            showSorterTooltip={false}
            loading={isLoading}
            columns={columns}
            dataSource={filteredOrders}
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
