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

        // console.log(res.data);

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
    // {
    //   title: "productId",
    //   dataIndex: "productId",
    //   key: "productId",
    //   render: (value) => <span className="font-semibold">{value}</span>,
    // },
    {
      key: "imageUrl",
      title: "imageUrl",
      dataIndex: "imageUrl",
      render: (url) => (
        <Image style={{ maxWidth: 100, minWidth: 50 }} src={toImageLink(url)} />
      ),
    },
    {
      key: "productName",
      title: "productName",
      dataIndex: "productName",

      render: (value) => (
        <div className="truncate capitalize w-24 md:w-48">{value}</div>
      ),
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },

    { key: "colorName", title: "colorName", dataIndex: "colorName" },
    { key: "sizeName", title: "sizeName", dataIndex: "sizeName" },
    { key: "originPrice", title: "originPrice", dataIndex: "originPrice" },
    {
      key: "price",
      title: "price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    { key: "quantity", title: "quantity", dataIndex: "quantity" },
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
              orderStatus: getStatusOrder(orders.orderStatus),
            }}
          >
            <div className="flex space-x-2">
              <div className="w-full">
                <Form.Item label="Ngày đặt" name="orderDate">
                  <Input readOnly value={formatDateTime(orders?.orderDate)} />
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
                  <TextArea rows={3} readOnly value={orders.deliveryAddress} />
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
