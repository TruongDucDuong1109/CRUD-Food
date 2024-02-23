import axiosInstance from "../../utils/axiosConfig";

const getBrands = async () => {
  const response = await axiosInstance.get(`/Brand`);
  return response.data;
};

const createBrand = async (brand) => {
  const response = await axiosInstance.post(`Brand/`, brand);

  return response.data;
};
const updateBrand = async (brand) => {
  const response = await axiosInstance.put(`Brand/${brand.id}`, {
    title: brand.brandData.title,
  });

  return response.data;
};
const getBrand = async (id) => {
  const response = await axiosInstance.get(`Brand/${id}`);

  return response.data;
};

const deleteBrand = async (id) => {
  const response = await axiosInstance.delete(`Brand/${id}`);

  return response.data;
};

const brandService = {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;
