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
import { checkUser, authentication } from "../middleware/auth.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../config/cloudinary.js";
import fs from "node:fs";

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

router.post("/users/:id", checkUser, async (req, res) => {
  try {
    const username = req.params["id"].toLowerCase();
    const userDetails = await userModel.findOne({ username: username });

    const userBlogs = await blogs.find({ author: username });
    return res.status(200).json({
      user: userDetails,
      blogs: userBlogs,
      auth: res.locals.auth,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-Blog/:id/:blogId", checkUser, async (req, res) => {
  try {
    const blogId = req.params["blogId"];
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

    res.status(200).json({
      blogs: blogData,
      auth: res.locals.auth,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
});

router.post(
  "/create-blog",
  authentication,
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
        img: {
          public_id: imgUrl.public_id,
          url: imgUrl.secure_url,
        },
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

router.get("/get-users/:username", async (req, res) => {
  const ref = req.params["username"].toLowerCase();
  if (ref === "all" || !ref) {
    const users = await userModel.find({});
    res.status(200).json(users);
  } else {
    try {
      const user = await userModel.find({ username: ref });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error." });
    }
  }
});

router.put(
  "/update-blog/",
  authentication,
  upload.single("img"),
  async (req, res) => {
    const blogId = req.query.id;
    const user = res.locals.user.username;
    const UpdatedData = {
      title: req.body.title,
      description: req.body.description,
    };

    try {
      if (req.file) {
        const oldBlogData = await blogs.findOne({ _id: blogId });
        const outDatedImg = oldBlogData.img.public_id;
        const deleteImg = await deleteOnCloudinary(outDatedImg);
        const newImg = await uploadOnCloudinary(req.file.path);
        UpdatedData.img = {
          public_id: newImg.public_id,
          url: newImg.secure_url,
        };
        if (!newImg) {
          throw new Error("Failed to upload image to Cloudinary");
        }
        fs.unlinkSync(req.file.path);
      }
      const updatedBlog = await blogs.findOneAndUpdate(
        { _id: blogId, author: user },
        UpdatedData,
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
