import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const register = async (userData) => {
  const response = await axios.post(
    `${base_url}user/register`,
    userData
  );
  if (response.data) {
    return response.data;
  }
};

const login = async (userData) => {
  const respone = await axios.post(
    `${base_url}user/login`,
    userData
  );
  if (respone.data) {
    localStorage.setItem("user", JSON.stringify(respone.data));
  }
  return respone.data;
};

export const authService = {
  register,
  login,
};
