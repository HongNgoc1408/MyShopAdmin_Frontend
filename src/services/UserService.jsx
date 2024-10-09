import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/user";

const getAllUser = async (page, pageSize, search) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? "",
    },
  });

const UserService = {
  getAllUser,
};

export default UserService;
