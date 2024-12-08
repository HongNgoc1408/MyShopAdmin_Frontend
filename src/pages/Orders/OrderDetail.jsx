import React, { useEffect, useState } from "react";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { HomeTwoTone } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  formatDateTime,
  formatVND,
  showError,
  statusOrder,
  toImageLink,
} from "../../services/commonService";
import OrderService from "../../services/OrderService";
import { Form, Image, Input, Spin, Table } from "antd";
import TextArea from "antd/es/input/TextArea";

const breadcrumb = (id) => [
  {
    path: "/",
    title: <HomeTwoTone />,
  },
  {
    path: "/orders",
    title: "Đơn hàng",
  },
  {
    title: `Chi tiết đơn hàng ${id}`,
  },
];

const OrderDetail = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await OrderService.getDetail(id);

        console.log(res.data);

        setOrders(res.data);
      } catch (error) {
        console.error("Error:", error);
        showError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, form]);

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      key: "productId",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "imageUrl",
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      render: (url) => (
        <Image style={{ maxWidth: 60, minWidth: 50 }} src={toImageLink(url)} />
      ),
    },
    {
      key: "productName",
      title: "Tên sản phẩm",
      dataIndex: "productName",
      render: (value) => <div className="capitalize">{value}</div>,
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },

    { key: "colorName", title: "Màu sắc", dataIndex: "colorName" },
    { key: "sizeName", title: "Kích cỡ", dataIndex: "sizeName" },
    { key: "originPrice", title: "Giá", dataIndex: "originPrice" },
    {
      key: "price",
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    { key: "quantity", title: "Số lượng", dataIndex: "quantity" },
  ];

  const getStatusOrder = (status) => {
    const stt = statusOrder.find((item) => item.value === status);
    return stt ? stt.label : "Phương thức không xác định";
  };

  // const orderStatus = orders.orderStatus || "";

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
      {isLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              ...orders,
              orderDate: formatDateTime(orders.orderDate),
              expected_delivery_time: orders?.expected_delivery_time
                ? formatDateTime(orders.expected_delivery_time)
                : "",
              orderStatus: getStatusOrder(orders.orderStatus),
              total: formatVND(orders.total),
              shippingCost: formatVND(orders.shippingCost),
              amountPaid: formatVND(orders.amountPaid),
            }}
          >
            <div className="flex space-x-2">
              <div className="w-full">
                <Form.Item label="Ngày đặt" name="orderDate">
                  <Input readOnly value={formatDateTime(orders?.orderDate)} />
                </Form.Item>

                <Form.Item label="Ngày dự kiến" name="expected_delivery_time">
                  <Input
                    readOnly
                    value={formatDateTime(orders?.expected_delivery_time)}
                  />
                </Form.Item>
                <Form.Item label="Trạng thái đơn hàng" name="orderStatus">
                  <Input readOnly value={orders.orderStatus} />
                </Form.Item>
                <Form.Item label="Phương thức thanh toán" name="paymentMethod">
                  <Input readOnly value={orders.paymentMethod} />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item label="Tổng tiền" name="total">
                  <Input readOnly value={formatVND(orders.total)} />
                </Form.Item>
                <Form.Item label="Tiền vận chuyển" name="shippingCost">
                  <Input readOnly value={formatVND(orders.shippingCost)} />
                </Form.Item>
                <Form.Item label="Tiền đã thanh toán" name="amountPaid">
                  <Input readOnly value={formatVND(orders.amountPaid)} />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item label="Thông tin khách hàng" name="email">
                  <Input readOnly value={orders.email} />
                </Form.Item>
                <Form.Item label="Thông tin khách hàng" name="receiver">
                  <Input readOnly value={orders.receiver} />
                </Form.Item>
                <Form.Item label="Địa chỉ khách hàng" name="deliveryAddress">
                  <TextArea rows={5} readOnly value={orders.deliveryAddress} />
                </Form.Item>
              </div>
            </div>
          </Form>
          <Table
            dataSource={orders.productOrderDetails}
            columns={columns}
            showSorterTooltip={false}
            loading={isLoading}
            className="overflow-x-auto"
          />
          ;
        </>
      )}
    </div>
  );
};

export default OrderDetail;
