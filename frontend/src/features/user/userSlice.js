import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const initialState = {
  user: "",
  isError: false,
  isSuccess: false,
  isloading: false,
  message: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isloading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.createdUser = action.payload;
        if (state.isSuccess === true) {
          toast.info("Đăng ký thành công");
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Đăng ký thất bại");
        }
      })

      .addCase(loginUser.pending, (state) => {
        state.isloading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
        if (state.isSuccess === true) {
          localStorage.setItem("token", action.payload.token);

          toast.info("Đăng nhập thành công");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Đăng nhập thất bại");
        }
      });
  },
});

export default authSlice.reducer;
