import axios from "axios";
import { authHeader, authImageHeader } from "./authHeader";
import CategoryService from "./CategoryService";
import SizeService from "./SizeService";
import BrandService from "./BrandService";

const API_URL = process.env.REACT_APP_API_URL + "/api/products";

const getAll = async (page, pageSize, keySearch) =>
  await axios.get(API_URL, {
    params: {
      page: page,
      pageSize: pageSize,
      key: keySearch ?? "",
    },
  });

const getById = async (id, data) => await axios.get(API_URL + `/${id}`, data);

const add = async (data) =>
  await axios.post(API_URL + "/create", data, { headers: authImageHeader() });

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

const fetchProductAttributes = async () => {
  try {
    const brandsData = BrandService.getAll();
    const categoriesData = CategoryService.getAll();
    const sizesData = SizeService.getAll();

    const [brands, categories, sizes] = await Promise.all([
      brandsData,
      categoriesData,
      sizesData,
    ]);
    const data = {
      brands: brands.data,
      categories: categories.data,
      sizes: sizes.data,
    };

    return data;
  } catch (error) {
    return new Error(error);
  }
};

const getName = async () =>
  await axios.get(API_URL + "/name", { headers: authHeader() });

const getColorById = async (id) =>
  await axios.get(API_URL + `/color/${id}`, { headers: authHeader() });

const getSizeById = async (id) =>
  await axios.get(API_URL + `/size/${id}`, { headers: authHeader() });

const getReview = async (id, page, pageSize, key) =>
  await axios.get(API_URL + `/${id}/reviews`, {
    params: {
      page: page,
      pageSize: pageSize,
      key: key ?? "",
    },
    headers: authHeader(),
  });

const ProductService = {
  getAll,
  getName,
  getColorById,
  getSizeById,
  add,
  getById,
  update,
  remove,
  updateEnable,
  fetchProductAttributes,
  getReview,
};

export default ProductService;
