const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongobld");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

//Create a User
const createUser = asyncHandler(async (req, res) => {
  // try {

  //   console.log("Request Body:", req.body);

  //   const user = await User.findOne({ email: req.body.email });

  //   if (user) return res.status(409).send({ message: "User with given email already Exist!" });

  //   const salt = await bcrypt.genSalt(Number(process.env.SALT));
  //   const hashPassword = await bcrypt.hash(req.body.password, salt);

  //   const usernew = await new User({ ...req.body, password: hashPassword }).save();
  //   res.json(usernew);
  //   res.status(201).send({ message: "User created successfully" });
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).send({ message: "Internal Server Error" });
  // }

  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

//Login a User
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log("Request Body:", req.body);
  const findUser = await User.findOne({ email });
  console.log("Received Password:", password);
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?.id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      token: findUser?.generateAuthToken(),
      brands: findUser?.brands,
    });
  } else {
    throw new Error("Invalid Email or Password");
  }
});

//adminlogin

const loginAdminCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findAdmin = await User.findOne({ email });
  if (findAdmin?.role !== "admin")
    throw new Error("You are not an admin");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin?.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?.id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      token: findAdmin?.generateAuthToken(),
    });
  } else {
    throw new Error("Invalid Email or Password");
  }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No refresh token found");
  }
  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("NO refresh token present in DB or match found");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with the refresh");
    }
    const accessToken = generateRefreshToken(user?._id);
    res.json({ accessToken });
  });
});

//logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No refresh token found");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

// get All Users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getaUser = await User.find();
    res.json(getaUser);
  } catch (error) {
    throw new Error(error);
  }
});

//get a single user

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    // Kiểm tra xem req.user có được xác định và có thuộc tính email không
    if (req.user && req.user.email) {
      const getaUser = await User.findById(id);
      res.json(getaUser);
    } else {
      // Xử lý trường hợp req.user hoặc req.user.email là null hoặc không xác định
      res
        .status(401)
        .json({ message: "Người dùng chưa được xác thực" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

//update a User

const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a single user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `HI, Please folow this link to reset your password <a href = 'http://localhost:2000/api/user/reset-password/${token}'>Click here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token is invalid or has expired");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//save user Address

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { items } = req.body; // Thay vì lấy ra productId và quantity, lấy mảng items chứa thông tin của các sản phẩm
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    // Tạo một mảng mới chứa các đối tượng Cart từ mảng items
    const newCarts = await Cart.insertMany(
      items.map((item) => ({
        userId: _id,
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    res.json(newCarts);
  } catch (error) {
    throw new Error(error);
  }
});


const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({
      userId: _id,
    }).populate("productId");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const {cartItemId} = req.params;
  try {
    const deleteProductFromcart = await Cart.deleteOne({ userId: _id, _id: cartItemId});
    res.json(deleteProductFromcart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { cartDetailId, newQuantity } = req.params; // Changed from cartItemId to cartDetailId
  try {
    const cartItem = await Cart.findOneAndUpdate(
      { userId: _id, _id: cartDetailId }, // Find cart item by _id
      { quantity: newQuantity }, // Update quantity
      { new: true } // Return the updated document
    );
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});


const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});

// const createOrder = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   const { COD, couponApplied } = req.body;
//   console.log(COD, couponApplied);
//   try {
//     if (!COD) throw new Error("Create order failed");
//     const user = await User.findById(_id);
//     let userCart = await Cart.findOne({ orderby: user._id });
//     let finalAmount = 0;
//     if (couponApplied && userCart.totalAfterDiscount) {
//       finalAmount = userCart.totalAfterDiscount;
//     } else {
//       finalAmout = userCart.cartTotal;
//     }

//     let newOrder = await new Order({
//       products: userCart.products,
//       paymentIntent: {
//         id: uniqid(),
//         method: "COD",
//         amount: finalAmount,
//         status: "Cash on Delivery",
//         created: Date.now(),
//         currency: "usd",
//       },
//       orderby: user._id,
//       orderStatus: "Cash on Delivery",
//     }).save();
//     let update = userCart.products.map((item) => {
//       return {
//         updateOne: {
//           filter: { _id: item.product._id },
//           update: {
//             $inc: { quantity: -item.count, sold: +item.count },
//           },
//         },
//       };
//     });
//     const updated = await Product.bulkWrite(update, {});
//     res.json({ message: "success" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const createOrder = asyncHandler(async (req, res) => {
  const orderItems = req.body.orderItems; 
  const { _id } = req.user;
  try {
    // Tạo đơn hàng mới
    const order = await Order.create({
      orderItems,
      user: _id
    });
    res.json({
      order,
      success: true
    });
  } catch (error) {
    console.error("Error creating order:", error); 
    res.status(500).json({
      success: false,
      message: "Error creating order"
    });
  }
});



const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id); 
  try {
    // Tìm tất cả các đơn hàng của người dùng dựa trên id của người dùng
    const userOrders = await Order.find({ user: _id })
      .populate("orderItems.product") 
      .exec();

    res.json(userOrders); 
  } catch (error) {
    throw new Error(error); 
  }
});


const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Tìm tất cả các đơn hàng và populate thông tin sản phẩm và thông tin người dùng
    const allUserOrders = await Order.find()
      .populate("orderItems.product")
      .populate("user") 
      .exec();
    console.log("All orders:", allUserOrders); 
    res.json(allUserOrders);
  } catch (error) {
    throw new Error(error); 
  }
});


const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.find({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});


const getProductTotalOrderedQuantity = asyncHandler(async (req, res) => {
  try {
    const allOrders = await Order.find().populate('products.product'); // Sử dụng populate để lấy thông tin chi tiết của sản phẩm

    const productQuantities = {};

    // Lặp qua từng đơn đặt hàng
    allOrders.forEach((order) => {
      // Lặp qua từng sản phẩm trong đơn đặt hàng
      order.products.forEach((product) => {
        const productId = product.product._id; // Lấy ID của sản phẩm
        const quantity = product.count; // Lấy số lượng sản phẩm đã đặt hàng trong đơn đặt hàng này

        // Nếu sản phẩm đã tồn tại trong đối tượng productQuantities, thêm số lượng mới vào tổng số lượng đã được đặt hàng
        if (productQuantities[productId]) {
          productQuantities[productId].totalOrderedQuantity += quantity;
        } else {
          // Nếu sản phẩm chưa tồn tại trong đối tượng productQuantities, tạo một mục mới với thông tin sản phẩm và số lượng đã được đặt hàng ban đầu
          productQuantities[productId] = {
            _id: product.product._id,
            title: product.product.title,
            totalOrderedQuantity: quantity,
          };
        }
      });
    });

    res.json(Object.values(productQuantities)); // Trả về mảng các đối tượng chứa thông tin sản phẩm và tổng số lượng đã được đặt hàng cho mỗi sản phẩm
  } catch (error) {
    throw new Error(error);
  }
});




const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdminCtrl,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderByUserId,
  getProductTotalOrderedQuantity,
  removeProductFromCart,
  updateProductQuantityFromCart,
};
