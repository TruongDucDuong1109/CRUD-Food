import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const getProducts = async () => {
  const respone = await axios.get(`${base_url}product`);
  if (respone.data) {
    return respone.data;
  }
};

export const productService = {
  getProducts,
};
