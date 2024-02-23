import axiosInstance from "../../utils/axiosConfig";

const register = async (userData) => {
  const response = await axiosInstance.post("/user/register", userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axiosInstance.post("/user/login", userData);
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};
const getUsers = async () => {
  const response = await axiosInstance.get(`/user/all-users`);

  return response.data;
};

const addToCart = async (cartData) => {
  const response = await axiosInstance.post("/user/cart", cartData);
  return response.data;
};

const getToCart = async () => {
  const response = await axiosInstance.get("/user/cart");
 
  return response.data;
};

const removeProductFromCart = async (id) => {
  const response = await axiosInstance.delete(`/user/delete-product-cart/${id}`);
  return response.data;
};

const updateProductFromCart = async (cartDetailId, newQuantity) => { 
  const response = await axiosInstance.put(`/user/update-product-cart/${cartDetailId}/${newQuantity}`); 
  return response.data;
};

const Order = async (cartData) => {
  try {
    const response = await axiosInstance.post("/user/cart/cash-order", cartData);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};


export const authService = {
  register,
  login,
  addToCart,
  getToCart,
  removeProductFromCart,
  updateProductFromCart,
  Order,
  getUsers
};
