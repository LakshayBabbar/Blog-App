import commentModel from "../models/commentModel.js";
import blogs from "../models/blogModel.js";
import mongoose from "mongoose";

export const createComment = async (req, res) => {
  const blogId = req.params["blogId"];
  const { _id, username } = res.locals.user;
  const description = req.body.description;

  try {
    if (!mongoose.isValidObjectId(blogId)) {
      return res.status(400).json({
        message: "Invalid blog ID.",
      });
    }
    const blog = await blogs.findOne({ _id: blogId });
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found.",
      });
    }
    const newComment = await commentModel.create({
      blogId,
      userId: _id,
      username,
      description,
    });
    if (!newComment) {
      throw new Error("Error while adding comment.");
    }
    res.status(200).json({
      message: "Comment created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.name,
    });
  }
};

export const getAllComments = async (req, res) => {
  const blogId = req.params["blogId"];
  const username = res.locals.username;
  try {
    const comments = await commentModel.find({ blogId }).lean();
    const sortedComments = comments.map((item) => {
      return { ...item, isUser: item.username === username };
    });
    res.status(200).json(sortedComments);
  } catch (error) {
    res.status(500).json({
      message: error.name,
    });
  }
};

export const deleteComment = async (req, res) => {
  const commentId = req.params["commentId"];
  const userId = res.locals.user._id;
  try {
    const comment = await commentModel.findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }
    if (userId.toString() !== comment.userId.toString()) {
      return res.status(401).json({
        message: "User is not authorised.",
      });
    }
    await commentModel.findByIdAndDelete(commentId);
    return res.status(200).json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.name,
    });
  }
};
