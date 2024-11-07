import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/statistic";

const getToTalUser = async () => {
  return await axios.get(API_URL + "/totalUser", {
    headers: authHeader(),
  });
};

const getToTalProduct = async () => {
  return await axios.get(API_URL + "/totalProduct", {
    headers: authHeader(),
  });
};
const getToTalOrder = async () => {
  return await axios.get(API_URL + "/totalOrder", {
    headers: authHeader(),
  });
};
const getToTalOrderDone = async () => {
  return await axios.get(API_URL + "/totalOrderDone", {
    headers: authHeader(),
  });
};
const getToTalImport = async () => {
  return await axios.get(API_URL + "/totalImport", {
    headers: authHeader(),
  });
};

const getTotalRevenueYear = async (year, month) => {
  return await axios.get(API_URL + "/totalRevenueYear", {
    headers: authHeader(),
    params: {
      year,
      month,
    },
  });
};

const getTotalRevenue = async (dateFrom, dateTo) => {
  return await axios.get(API_URL + "/totalRevenue", {
    headers: authHeader(),
    params: {
      dateFrom,
      dateTo,
    },
  });
};

const StatisticService = {
  getToTalUser,
  getToTalProduct,
  getToTalOrder,
  getToTalOrderDone,
  getToTalImport,
  getTotalRevenueYear,
  getTotalRevenue,
};

export default StatisticService;
