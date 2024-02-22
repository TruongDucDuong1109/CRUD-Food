import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { productService } from "./productService";
import { toast } from "react-toastify";

export const getAllProducts = createAsyncThunk(
  "product/getall",
  async (thunkAPI) => {
    try {
      return await productService.getProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const productState = {
  product: "",
  isError: false,
  isSuccess: false,
  isloading: false,
  message: "",
};

export const productSlice = createSlice({
  name: "product",
  initialState: productState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.pending, (state) => {
      state.isloading = true;
    })
    .addCase(getAllProducts.fulfilled, (state, action) => {
      state.isloading = false;
      state.isError = false;
      state.isSuccess = true;
      state.product = action.payload;
    })
    .addCase(getAllProducts.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
  },
});

export default productSlice.reducer;
