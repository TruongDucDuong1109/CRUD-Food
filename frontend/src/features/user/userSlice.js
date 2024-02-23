import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "./userService";
import { toast } from "react-toastify";

const getUserfromLocalStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;


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
export const getUsers = createAsyncThunk(
  "customer/get-customers",
  async (thunkAPI) => {
    try {
      return await authService.getUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addProdToCart = createAsyncThunk(
  "auth/addProdToCart",
  async (cartData, thunkAPI) => {
    try {
      return await authService.addToCart(cartData);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
)


export const getUsercart = createAsyncThunk(
  "auth/getUsercart",
  async (thunkAPI) => {
    try {
      return await authService.getToCart();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
)

export const deleteCartProduct = createAsyncThunk(
  "auth/delete product cart",
  async (id,thunkAPI) => {
    try {
      return await authService.removeProductFromCart(id);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
)


export const updateCartProduct = createAsyncThunk(
  "auth/updateProductCart",
  async ({ cartDetailId, newQuantity }, thunkAPI) => { // Pass both cartDetailId and newQuantity
    try {
      return await authService.updateProductFromCart(cartDetailId, newQuantity); // Pass both cartDetailId and newQuantity to the service function
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const makePayment = createAsyncThunk(
  "auth/cart/makePayment",
  
  async (cartData, thunkAPI) => {
    try {
      
      const orderItems = cartData.map((item) => ({
        product: item.productId._id, 
        quantity: item.quantity 
      }));
      
      // Gọi hàm authService để thực hiện thanh toán, truyền dữ liệu orderItems đã được chuyển đổi vào
      const response = await authService.Order({ user: cartData.userId, orderItems }); // Gửi dữ liệu orderItems đã được chuyển đổi và userId
      console.log("response", response);
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);









const initialState = {
  user: getUserfromLocalStorage,
  cartProduct: "",
  cartProducts: "",
  getUsers: [],
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
      })
      .addCase(addProdToCart.pending, (state) => {
        state.isloading = true;
      })
      .addCase(addProdToCart.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProduct = action.payload;
        if (state.isSuccess === true) {
          toast.info("Thêm sản phẩm vào giỏ hàng thành công");
        }
      })
      .addCase(addProdToCart.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Thêm sản phẩm vào giỏ hàng thất bại");
        }
      })
      .addCase(getUsercart.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getUsercart.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cartProducts = action.payload;
      })
      .addCase(getUsercart.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      })
      .addCase(deleteCartProduct.pending, (state) => {
        state.isloading = true;
      })
      .addCase(deleteCartProduct.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.deleteCartProduct = action.payload;
        if (state.isSuccess === true) {
          toast.info("Xóa sản phẩm khỏi giỏ hàng thành công");
        }
      })
      .addCase(deleteCartProduct.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Xóa sản phẩm khỏi giỏ hàng thất bại");
        }
      })
      .addCase(updateCartProduct.pending, (state) => {
        state.isloading = true;
      })
      .addCase(updateCartProduct.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.updateCartProduct = action.payload;
        if (state.isSuccess === true) {
          toast.info("Cập nhật giỏ hàng thành công");
        }
      })
      .addCase(updateCartProduct.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Cập nhật giỏ hàng thất bại");
        }
      })
      // .addCase(Order.pending, (state) => {
      //   state.isloading = true;
      // })
      // .addCase(Order.fulfilled, (state, action) => {
      //   state.isloading = false;
      //   state.isError = false;
      //   state.isSuccess = true;
      //   state.Order = action.payload;
      //   if (state.isSuccess === true) {
      //     toast.info("Đặt hàng thành công");
      //   }
      // })
      // .addCase(Order.rejected, (state, action) => {
      //   state.isloading = false;
      //   state.isError = true;
      //   state.isSuccess = false;
      //   state.message = action.error.message;
      //   if (state.isError === true) {
      //     toast.info("Đặt hàng thất bại");
      //   }
      // })
      .addCase(makePayment.pending, (state) => {
        state.isloading = true;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.makePayment = action.payload;
        if (state.isSuccess === true) {
          toast.info("Thanh toán thành công");
        }
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
        if (state.isError === true) {
          toast.info("Thanh toán thất bại");
        }
      })
      .addCase(getUsers.pending, (state) => {
        state.isloading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isloading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getUsers = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isloading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.error.message;
      });
  },
});

export default authSlice.reducer;
