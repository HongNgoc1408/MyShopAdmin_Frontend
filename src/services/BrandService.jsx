import axios from "axios";
import { authHeader, authImageHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/brands";

const getAll = async () => await axios.get(API_URL, { headers: authHeader() });

const add = async (data) =>
  await axios.post(API_URL + "/create", data, { headers: authImageHeader() });

const update = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, {
    headers: authImageHeader(),
  });

const remove = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() });

const BrandService = {
  getAll,
  add,
  update,
  remove,
};

export default BrandService;
