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

const getToTalOrderCanceled = async () => {
  return await axios.get(API_URL + "/totalOrderCanceled", {
    headers: authHeader(),
  });
};

const getToTalOrderNew = async () => {
  return await axios.get(API_URL + "/totalOrderNew", {
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

const getRevenueProductYear = async (productId, year, month) => {
  return await axios.get(API_URL + "/totalRevenueProductYear", {
    headers: authHeader(),
    params: {
      productId,
      year,
      month,
    },
  });
};

const getRevenueProduct = async (productId, dateFrom, dateTo) => {
  return await axios.get(API_URL + "/totalRevenueProduct", {
    headers: authHeader(),
    params: {
      productId,
      dateFrom,
      dateTo,
    },
  });
};

const getTopProductYear = async (year, month) => {
  return await axios.get(API_URL + "/topSellingProductsByYear", {
    headers: authHeader(),
    params: {
      year,
      month,
    },
  });
};

const getTopProduct = async (dateFrom, dateTo) => {
  return await axios.get(API_URL + "/topSellingProducts", {
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
  getToTalOrderCanceled,
  getToTalOrderNew,
  getToTalImport,
  getTotalRevenueYear,
  getTotalRevenue,
  getRevenueProductYear,
  getRevenueProduct,
  getTopProductYear,
  getTopProduct,
};

export default StatisticService;
