import express from "express";
import multer from "multer";
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
  searchBlog,
} from "../controllers/blogController.js";
import {
  createComment,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Authentication Routes
router.post("/signup", registerController);
router.post("/login", loginController);

// Users Routes
router.get("/users/:id", checkUser, getUserDetails);
router.get("/get-users/:username", getAllUsers);
router.put("/update-user/", authentication, upload.single("img"), updateUser);
router.delete("/delete-user", authentication, deleteUser);

// Blogs Routes
router.get("/get-blogs", getAllBlogs);
router.get("/get-blog/:blogId", checkUser, getBlogById);
router.post("/create-blog", authentication, upload.single("img"), createBlog);
router.put(
  "/update-blog/:id",
  authentication,
  upload.single("img"),
  updateBlog
);
router.delete("/delete-blog/:id", authentication, deleteBlog);

// Comments routes
router.post("/create-comment/:blogId", authentication, createComment);
router.get("/get-comments/:blogId", checkUser, getAllComments);
router.delete("/delete-comment/:commentId", authentication, deleteComment);

router.get("/search/:id", searchBlog);

export default router;
