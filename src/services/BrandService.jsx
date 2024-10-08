import axios from "axios";

// Thiết lập base URL
const API_URL = process.env.REACT_API_URL + "api/brand";

// export const getAllBrand = async () => {
//   const res = await axios.get(`/brand/getAllBrand`);
//   return res.data;
// };

// export const getByIdBrand = async (id) => {
//   const res = await axios.get(`/brand/get/${id}`);
//   return res.data;
// };

// export const addBrand = async (data) => {
//   const res = await axios.post(`/brand/add`, data);
//   return res.data;
// };

// export const updateBrand = async (id, access_token, data) => {
//   const res = await axios.put(`/brand/update/${id}`, data, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return res.data;
// };

// export const deleteBrand = async (id, access_token) => {
//   const res = await axios.delete(`/brand/delete/${id}`, {
//     headers: {
//       token: `Bearer ${access_token}`,
//     },
//   });
//   return res.data;
// };
