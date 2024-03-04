import express from "express";
import upload from "../middleware/multer.js";
import { authentication, checkUser } from "../middleware/auth.js";
import {
  registerController,
  loginController,
} from "../controllers/authController.js";
import {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", registerController);
router.post("/login", loginController);

// Users Routes
router.get("/users/:id", checkUser, getUserDetails);
router.get("/get-users/:username", getAllUsers);
router.put("/update-user/", authentication, upload.single("img"), updateUser);
router.delete("/delete-user", authentication, deleteUser);

// Blogs Routes
router.get("/all-blogs", getAllBlogs);
router.get("/get-blog/:blogId", checkUser, getBlogById);
router.post("/create-blog", authentication, upload.single("img"), createBlog);
router.put(
  "/update-blog/:id",
  authentication,
  upload.single("img"),
  updateBlog
);
router.delete("/delete-blog/:id", authentication, deleteBlog);

export default router;
