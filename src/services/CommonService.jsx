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
