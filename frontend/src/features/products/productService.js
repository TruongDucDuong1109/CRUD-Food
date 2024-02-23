import axiosInstance from "../../utils/axiosConfig";

const getProducts = async () => {
  const response = await axiosInstance.get("/product");
  return response.data;
};

export const productService = {
  getProducts,
};
