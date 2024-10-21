import React, { useEffect, useState } from "react";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { HomeTwoTone } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  formatDateTime,
  formatVND,
  showError,
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
      title: "productId",
      dataIndex: "productId",
      key: "productId",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
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

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
      {isLoading ? (
        <Spin tip="Loading..." />
      ) : (
        <>
          <div className="flex space-x-5">
            <div className="w-full">
              <Input
                className="my-2"
                placeholder={formatDateTime(orders.orderDate)}
                defaultValue={formatDateTime(orders.orderDate)}
              />
              <Input
                className="my-2"
                placeholder={orders.orderStatus}
                defaultValue={orders.orderStatus}
              />
              <Input
                className="my-2"
                placeholder={orders.paymentMethod}
                defaultValue={orders.paymentMethod}
              />
            </div>
            <div className="w-full">
              <Input
                className="my-2"
                placeholder={formatVND(orders.total)}
                defaultValue={formatVND(orders.total)}
              />
              <Input
                className="my-2"
                placeholder={formatVND(orders.shippingCost)}
                defaultValue={formatVND(orders.shippingCost)}
              />
              <Input
                className="my-2"
                placeholder={formatVND(orders.amountPaid)}
                defaultValue={formatVND(orders.amountPaid)}
              />
            </div>
            <div className="w-full">
              <Input
                className="my-2"
                placeholder={orders.receiver}
                defaultValue={orders.receiver}
              />
              <TextArea
                rows={3}
                className="my-2"
                placeholder={orders.deliveryAddress}
                defaultValue={orders.deliveryAddress}
              />
            </div>
          </div>
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
