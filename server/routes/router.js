import express from "express";
import multer from "multer";
import { authentication, checkUser } from "../middleware/auth.js";
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
import passport from "passport";
import { googleAuth, logoutController } from "../controllers/authController.js";

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
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/login/failure",
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/login/success/",
    failureRedirect: "/login/failure",
  })
);
router.get("/login/failure", (req, res) => {
  return res.status(401).json({
    message: "Login failed",
    success: false,
  });
});
router.get("/login/success", googleAuth);
router.get("/logout", logoutController);

// Users Routes
router.get("/api/users", getAllUsers);
router.get("/api/users/:id", checkUser, getUserDetails);
router.put("/api/users/edit", authentication, handleUpload, updateUser);
router.delete("/api/users/delete", authentication, deleteUser);

// Blogs Routes
router.get("/api/blogs", getAllBlogs);
router.post("/api/blogs", authentication, handleUpload, createBlog);
router.get("/api/blogs/:id", checkUser, getBlogById);
router.put("/api/blogs/:id", authentication, handleUpload, updateBlog);
router.delete("/api/blogs/:id", authentication, deleteBlog);
router.put("/api/blogs/:id/likes", authentication, likesController);
router.get("/api/blogs/search/:id", searchBlog);

// Comments routes
router.post("/api/comments/:blogId", authentication, createComment);
router.get("/api/comments/:blogId", checkUser, getAllComments);
router.delete("/api/comments/:commentId", authentication, deleteComment);

export default router;
