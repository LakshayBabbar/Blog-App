import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/authController.js";
import { imageController } from "../controllers/imageConroller.js";
import upload from "../middleware/multer.js";
import blogs from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
// import { checkUser } from "../middleware/auth.js";

const router = express.Router();
router.post("/signup", registerController);
router.post("/login", loginController);
router.post("/file/upload", upload.single("file"), imageController);

router.get("/all-blogs", async (req, res) => {
  const category = req.query.category;
  if (category === "" || category === "all" || !category) {
    const blogData = await blogs.find({});
    res.status(200).json(blogData);
  } else {
    const blogData = await blogs.find({ category: category });
    res.status(200).json(blogData);
  }
});

router.post("/users/:id", async (req, res) => {
  const userName = req.params["id"];
  const userDetails = await userModel.find({ username: userName });
  if (userDetails.length !== 0 ) {
    const userBlogs = await blogs.find({ author: userName });
    return res.status(200).json({
      username: userDetails[0].username,
      fullname: userDetails[0].fullname,
      profileImg: userDetails[0].profileImg,
      joinDate: userDetails[0].createdAt,
      blogs: userBlogs,
    });
  }
  return res.status(404).json({
    message: "User not found."
  })
});

router.get('/get-Blog/:id', async (req, res) => {
  try {
    const blogId = req.params['id'];

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID."
      });
    }

    const blogData = await blogs.findById(blogId);
    
    if (!blogData) {
      return res.status(404).json({
        message: "Blog not found."
      });
    }
    
    res.status(200).json(blogData);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      message: "Internal server error."
    });
  }
});


export default router;
