import axios from "axios";
import { authHeader, authImageHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/orders";

const getAll = async (page, pageSize, keySearch) =>
  await axios.get(API_URL + "/get-all", {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      key: keySearch ?? "",
    },
  });

const getDetail = async (id) =>
  await axios.get(API_URL + `/${id}`, { headers: authImageHeader() });

const updateStatus = async (id, data) =>
  await axios.put(API_URL + `/updateStatus/${id}`, data, {
    headers: authHeader(),
  });

const remove = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() });

const shipping = async (id, data) =>
  await axios.put(API_URL + `/shipping/${id}`, data, { headers: authHeader() });

const getStatus = async (status, page, pageSize, key) =>
  await axios.get(API_URL + `/status/${status}`, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      key: key ?? "",
    },
  });

const OrderService = {
  getAll,
  getDetail,
  updateStatus,
  remove,
  shipping,
  getStatus,
};

export default OrderService;
