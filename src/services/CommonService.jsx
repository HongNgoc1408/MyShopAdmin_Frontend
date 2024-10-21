import { notification } from "antd";

const API_URL = process.env.REACT_APP_API_URL;

export const toImageLink = (link) => {
  return API_URL + "/" + link;
};

export const showError = (error) => {
  const errorMessage =
    error?.response?.data?.title || error?.response?.data || error?.message;

  notification.error({
    message: "Error",
    description: errorMessage,
  });
};

export const toImageSrc = (url) => API_URL + "/" + url;

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const dataValueLabel = (data) => {
  return data.map((item) => ({
    ...item,
    value: item.id,
    label: item.name,
  }));
};

export const formatVND = (value) => {
  const format = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  return format.format(value);
};

export const formatDateTime = (date) => new Date(date).toLocaleString("vi-VN");

export const toTextLabel = (data) => {
  return data.map((item) => ({
    ...item,
    value: item.id,
    label: item.name,
  }));
};

export const toTextValue = (data) => {
  return data.map((value) => ({
    value: value,
    text: value,
  }));
};

export const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === "{}";
};
// export const sizes = [
//   { value: "XS", label: "XS" },
//   { value: "S", label: "S" },
//   { value: "M", label: "M" },
//   { value: "L", label: "L" },
//   { value: "XL", label: "XL" },
//   { value: "XXL", label: "XXL" },
//   { value: "XXXL", label: "XXXL" },
// ];

export const paymentMethod = [
  { value: "COD", label: "Thanh toán khi nhận hàng" },
  { value: "VNPay", label: "Thanh toán ví VNPay" },
];

export const statusOrders = [
  { value: 0, label: "Đang xử lý" },
  { value: 1, label: "Đã duyệt" },
  { value: 2, label: "Đang chờ lấy hàng" },
  { value: 3, label: "Đang vận chuyển" },
  { value: 4, label: "Đang giao hàng" },
  { value: 5, label: "Đã nhận" },
  { value: 6, label: "Đã hủy" },
];
