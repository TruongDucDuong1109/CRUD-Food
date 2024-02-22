const express = require("express");
const {
  loginAdminCtrl,
  updateOrderStatus,
  createOrder,
  applyCoupon,
  emptyCart,
  getWishlist,
  createUser,
  resetPassword,
  forgotPasswordToken,
  blockUser,
  updatePassword,
  unblockUser,
  updateUser,
  loginUserCtrl,
  getallUser,
  getSingleUser,
  deleteUser,
  handleRefreshToken,
  logout,
  saveAddress,
  userCart,
  getUserCart,
  getOrders,
  getAllOrders,
  getOrderByUserId,
  getProductTotalOrderedQuantity,
} = require("../controller/userCtrl");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/authMiddeware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdminCtrl);

router.post("/cart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);

router.post("/forgot-password-token", forgotPasswordToken);
router.post("/cart/cash-order", authMiddleware, createOrder);

router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);
router.get("/all-users", getallUser);

router.get("/cart", authMiddleware, getUserCart);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/get-allorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getwishlist", authMiddleware, getWishlist);
router.get(
  "/gettotalquantity",
  authMiddleware,
  getProductTotalOrderedQuantity
);

router.post("/getorderbyuser/:id", authMiddleware, getOrderByUserId);

router.get("/logout", logout);
router.get("/a-user/:id", authMiddleware, isAdmin, getSingleUser);

router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/delete/:id", deleteUser);
router.put("/update", authMiddleware, updateUser);
router.put("/save-address", authMiddleware, saveAddress);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.get("/refresh", handleRefreshToken);
module.exports = router;
