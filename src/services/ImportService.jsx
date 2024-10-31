import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/import";

const getAll = async (page, pageSize, keySearch) =>
  await axios.get(API_URL, {
    params: {
      page: page,
      pageSize: pageSize,
      key: keySearch ?? "",
    },
    headers: authHeader(),
  });

const getDetail = async (id) =>
  await axios.get(API_URL + `/${id}`, { headers: authHeader() });

const add = async (data) =>
  await axios.post(API_URL, data, { headers: authHeader() });

const ImportService = {
  getAll,
  getDetail,
  add,
};
export default ImportService;
