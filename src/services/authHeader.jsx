import Cookies from "js-cookie";

export const authHeader = () => {
  const token = Cookies.get("access_token_admin");
  if (token) {
    return {
      Authorization: "Bearer " + token,
    };
  } else return {};
};

export const authImageHeader = () => {
  const token = Cookies.get("access_token_admin");
  if (token) {
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    };
  } else return {};
};
