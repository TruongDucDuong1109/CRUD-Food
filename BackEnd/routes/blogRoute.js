const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogCtrl");
const {
  authMiddleware,
  isAdmin,
} = require("../middlewares/authMiddeware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.get("/get-blog/:id", authMiddleware, isAdmin, getBlog);
router.put("/likes", authMiddleware, isAdmin, likeBlog);
router.put("/dislikes", authMiddleware, isAdmin, dislikeBlog);
router.get("/get-all-Pblog", authMiddleware, isAdmin, getAllBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;
