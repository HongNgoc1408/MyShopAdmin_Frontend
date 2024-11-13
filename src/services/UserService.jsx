import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/user";

const getAll = async (page, pageSize, search, role) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      key: search ?? "",
      role: role,
    },
  });

const getAllUser = async (page, pageSize, search) =>
  await axios.get(API_URL + "/users", {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      key: search ?? "",
    },
  });

const getAllStaff = async (page, pageSize, search) => {
  return await axios.get(API_URL + "/staffs", {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      key: search ?? "",
    },
  });
};

const UserService = {
  getAll,
  getAllUser,
  getAllStaff,
};

export default UserService;
