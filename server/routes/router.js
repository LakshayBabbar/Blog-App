import express from "express";
import multer from "multer";
import { authentication, checkUser } from "../middleware/auth.js";
import {
  registerController,
  loginController,
  logoutController,
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
  likesController,
} from "../controllers/blogController.js";
import {
  createComment,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 },
});

const handleUpload = (req, res, next) => {
  upload.single("img")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size exceeds 1mb limit." });
      }
      return res
        .status(500)
        .json({ message: "An error occurred while uploading the file." });
    }
    next();
  });
};

// Authentication Routes
router.post("/signup", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);

// Users Routes
router.get("/users/:id", checkUser, getUserDetails);
router.get("/get-users/:username", getAllUsers);
router.put("/update-user/", authentication, handleUpload, updateUser);
router.delete("/delete-user", authentication, deleteUser);

// Blogs Routes
router.get("/get-blogs", getAllBlogs);
router.get("/get-blog/:blogId", checkUser, getBlogById);
router.post("/create-blog", authentication, handleUpload, createBlog);
router.put("/update-blog/:id", authentication, handleUpload, updateBlog);
router.put("/likes/:id", authentication, likesController);
router.delete("/delete-blog/:id", authentication, deleteBlog);

// Comments routes
router.post("/create-comment/:blogId", authentication, createComment);
router.get("/get-comments/:blogId", checkUser, getAllComments);
router.delete("/delete-comment/:commentId", authentication, deleteComment);

router.get("/search/:id", searchBlog);

export default router;
