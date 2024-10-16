import axios from "axios";
import { authHeader, authImageHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/orders";

const getAll = async () =>
  await axios.get(API_URL + "/get-all", { headers: authHeader() });

const getDetail = async (id, data) => await axios.get(API_URL, data);

const update = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, {
    headers: authImageHeader(),
  });

const remove = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() });

const updateEnable = async (id, data) =>
  await axios.put(API_URL + `/updateEnable/${id}`, data, {
    headers: authHeader(),
  });

const OrderService = {
  getAll,
  getDetail,
  update,
  remove,
  updateEnable,
};

export default OrderService;
