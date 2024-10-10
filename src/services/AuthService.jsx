import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL + "/api/auth";

const login = async (data) =>
  await axios.post(API_URL + "/login", data).then((res) => {
    const exp = 12 * 60 * 60 * 1000;
    const in12Hours = new Date(new Date().getTime() + exp);

    Cookies.set("user_data_admin", JSON.stringify(res.data), {
      expires: in12Hours,
    });
    Cookies.set("access_token_admin", res.data?.access_token, {
      expires: 12 * 60 * 60 * 1000,
    });
    return res;
  });

const getCurrentUser = () => {
  const user = Cookies.get("user_data_admin");
  return user ? JSON.parse(user) : user;
};

const setUserToken = (access_token) =>
  Cookies.set("access_token_admin", access_token, { expires: 5 * 60 * 1000 });

const logout = () => {
  Cookies.remove("user_data_admin");
  Cookies.remove("access_token_admin");
};

const refreshToken = async (data) =>
  await axios.post(API_URL + "/refresh-token", data);

const authService = {
  login,
  getCurrentUser,
  setUserToken,
  logout,
  refreshToken,
};

export default authService;
