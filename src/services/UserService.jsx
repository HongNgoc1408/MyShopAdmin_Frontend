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

const getUser = async (userId) =>
  await axios.get(API_URL + `/${userId}`, { headers: authHeader() });

const create = async (data) =>
  await axios.post(API_URL, data, { headers: authHeader() });

const update = async (id, data) =>
  await axios.put(API_URL + `/${id}`, data, { headers: authHeader() });

const updateAvatar = async (data) =>
  await axios.put(API_URL + "/avatar", data, { headers: authHeader() });

const getProfile = async () =>
  await axios.get(API_URL + "/profile", { headers: authHeader() });

const updateProfile = async (data) => {
  await axios.put(API_URL + "/profile", data, { headers: authHeader() });
};

const getAvatar = async () =>
  await axios.get(API_URL + "/avatar", { headers: authHeader() });

const UserService = {
  create,
  update,
  getAll,
  getUser,
  updateAvatar,
  getProfile,
  updateProfile,
  getAvatar,
};

export default UserService;
