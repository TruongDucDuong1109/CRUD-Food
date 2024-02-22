const express = require("express");
const route = express.Router();
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controller/productCtrl");
const { uploadPhot, productImgResize } = require("../middlewares/uploadImages");

const { isAdmin, authMiddleware } = require("../middlewares/authMiddeware");

route.post("/", authMiddleware, isAdmin, createProduct);
route.put('/upload/:id', authMiddleware, isAdmin, uploadPhot.array("images",10),productImgResize,uploadImages)
route.get("/:id",getaProduct);
route.put('/wishlist',authMiddleware,addToWishlist)
route.put('/rating',authMiddleware,rating);
route.put("/:id", authMiddleware, isAdmin, updateProduct);
route.delete("/:id", authMiddleware, isAdmin, deleteProduct);
route.get("/", getAllProduct);

module.exports = route;
