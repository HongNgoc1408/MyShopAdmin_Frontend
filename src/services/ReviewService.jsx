import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = process.env.REACT_APP_API_URL + "/api/reviews";

const update = async (id, data) =>
  await axios.put(API_URL + `/updateEnable/${id}`, data, {
    headers: authHeader(),
  });

const remove = async (id) =>
  await axios.delete(API_URL + `/${id}`, { headers: authHeader() });

const ReviewService = {
  remove,
  update,
};

export default ReviewService;
