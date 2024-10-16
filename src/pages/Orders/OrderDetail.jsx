import React, { useEffect, useState } from "react";
import BreadcrumbLink from "../../components/BreadcrumbLink";
import { HomeTwoTone } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  paymentMethod,
  showError,
  statusOrders,
} from "../../services/commonService";
import OrderService from "../../services/OrderService";

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
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [current, setCurrent] = useState(0);

  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
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
  }, [id]);

  const getPaymentMethodLabel = (method) => {
    const payment = paymentMethod.find((item) => item.value === method);
    return payment ? payment.label : "Phương thức không xác định";
  };

  const getStatusOrder = (status) => {
    const stt = statusOrders.find((item) => item.value === status);
    return stt ? stt.label : "Phương thức không xác định";
  };
  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
    </div>
  );
};

export default OrderDetail;
