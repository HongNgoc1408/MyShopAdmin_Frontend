import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/payments";

const getAll = async () => await axios.get(API_URL, { headers: authHeader() });

const add = async (data) =>
  await axios.post(API_URL, data, { headers: authHeader() });

const update = async (id, data) =>
  await axios.put(API_URL + `/${id}`, data, { headers: authHeader() });

const remove = async (id) =>
  await axios.delete(API_URL + `/${id}`, { headers: authHeader() });

const PaymentService = {
  getAll,
  add,
  update,
  remove,
};

export default PaymentService;
