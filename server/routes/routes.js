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
import { checkUser } from "../middleware/auth.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import fs from 'node:fs';

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
  if (userDetails.length !== 0) {
    const userBlogs = await blogs.find({ author: userName });
    return res.status(200).json({
      username: userDetails[0].username,
      firstname: userDetails[0].firstname,
      lastname: userDetails[0].lastname,
      profileImg: userDetails[0].profileImg,
      joinDate: userDetails[0].createdAt,
      blogs: userBlogs,
    });
  }
  return res.status(404).json({
    message: "User not found.",
  });
});

router.get("/get-Blog/:id", async (req, res) => {
  try {
    const blogId = req.params["id"];

    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID.",
      });
    }

    const blogData = await blogs.findById(blogId);

    if (!blogData) {
      return res.status(404).json({
        message: "Blog not found.",
      });
    }

    res.status(200).json(blogData);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.post(
  "/create-blog",
  checkUser,
  upload.single("img"),
  async (req, res) => {
    const { title, description, category } = req.body;
    const user = res.locals.user;

    try {
      // Upload image to Cloudinary
      const imgUrl = await uploadOnCloudinary(req.file.path);

      if (!imgUrl) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      // Create blog entry
      const newBlog = new blogs({
        title,
        description,
        category,
        img: imgUrl.url,
        author: user.username,
      });
      await newBlog.save();
      await fs.unlinkSync(req.file.path);
      res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
      console.error("Error creating blog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
