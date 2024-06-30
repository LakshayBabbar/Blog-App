import blogs from "../models/blogModel.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../config/cloudinary.js";
import commentModel from "../models/commentModel.js";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res) => {
  const category = req.query.category;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  try {
    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const countDocuments = await blogs.countDocuments(filter);
    const blogData = await blogs
      .find(filter)
      .sort({ likes: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      blogs: blogData,
      totalPages: Math.ceil(countDocuments / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blogRef = req.params["ref"];
    const userId = res.locals.user?._id || undefined;
    const blogData = await blogs.findOne({ url: blogRef }).lean();
    if (!blogData) {
      return res.status(404).json({
        message: "Blog not found.",
      });
    }
    const response = {
      ...blogData,
      auth: false,
    };
    if (userId) {
      response.isLiked = blogData.usersLiked.includes(userId.toString());
      response.auth = blogData.userId === userId.toString() ? true : false;
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

export const createBlog = async (req, res) => {
  const { title, description, category } = req.body;
  const user = res.locals.user;

  try {
    if (req.file) {
      const cloudinaryRes = await uploadOnCloudinary(req.file);
      if (!cloudinaryRes) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      const newBlog = new blogs({
        title,
        description,
        category,
        img: {
          public_id: cloudinaryRes.public_id,
          url: cloudinaryRes.url,
        },
        author: user.username,
        userId: user._id,
      });
      const createdBlog = await newBlog.save();
      return res.status(201).json({
        ...createdBlog._doc,
        message: "Blog created successfully!",
        success: true,
      });
    } else {
      return res.status(400).json({
        message: "Image is required",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const blogId = req.params["id"];
  const userId = res.locals.user._id;
  const UpdatedData = {
    title: req.body.title,
    description: req.body.description,
  };

  try {
    if (req.file) {
      const oldBlogData = await blogs.findOne({ _id: blogId });
      const outDatedImg = oldBlogData.img.public_id;
      await deleteOnCloudinary(outDatedImg);
      const newImg = await uploadOnCloudinary(req.file);
      UpdatedData.img = {
        public_id: newImg.public_id,
        url: newImg.url,
      };
      if (!newImg) {
        throw new Error("Failed to upload image to Cloudinary");
      }
    }
    const updatedBlog = await blogs.findOneAndUpdate(
      { _id: blogId, userId },
      UpdatedData,
      { new: true }
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    return res.status(200).json({ ...updatedBlog, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const deleteBlog = async (req, res) => {
  const blogId = req.params["id"];
  const user = res.locals.user.username;

  try {
    const blogData = await blogs.findOne({ _id: blogId });
    if (!blogData) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blogData.author !== user) {
      return res.status(403).json({ message: "User is not authorized." });
    }

    const BlogImg = blogData.img.public_id;
    await deleteOnCloudinary(BlogImg);
    await commentModel.deleteMany({ blogId: blogId });
    await blogs.findOneAndDelete({
      _id: blogId,
      author: user,
    });

    res.status(200).json({
      message: "Blog is deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchBlog = async (req, res) => {
  try {
    const id = req.params["id"];
    const blogData = await blogs.find({
      $or: [
        { title: { $regex: id, $options: "i" } },
        { category: { $regex: id, $options: "i" } },
        { author: { $regex: id, $options: "i" } },
      ],
    });

    if (!blogData) {
      return res.status(404).json({ message: "No blogs found" });
    }

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const likesController = async (req, res) => {
  const userId = res.locals.user._id;
  const blogId = req.params["id"];
  try {
    const blog = await blogs.findById(blogId);
    if (blog.usersLiked.includes(userId)) {
      await blogs.updateOne(
        { _id: blogId },
        { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
      );
      return res.json({
        messgae: "post unliked successfully",
        liked: false,
      });
    } else {
      await blogs.updateOne(
        { _id: blogId },
        { $inc: { likes: 1 }, $push: { usersLiked: userId } }
      );
      return res.json({
        messgae: "post liked successfully",
        liked: true,
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
