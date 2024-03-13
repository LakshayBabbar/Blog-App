import blogs from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../config/cloudinary.js";
import fs from "node:fs";

export const getUserDetails = async (req, res) => {
  try {
    const user = req.params["id"];
    const username = res.locals.username;
    const userDetails = await userModel.findOne({ username: user }).lean();

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const userBlogs = await blogs.find({ author: user });
    return res.status(200).json({
      ...userDetails,
      blogs: userBlogs,
      auth: user === username ? true : false,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  const ref = req.params["username"].toLowerCase();
  if (ref === "all" || !ref) {
    const users = await userModel.find({});
    res.status(200).json(users);
  } else {
    try {
      const user = await userModel.find({
        $or: [
          { firstname: { $regex: ref, $options: "i" } },
          { lastname: { $regex: ref, $options: "i" } },
          { username: { $regex: ref, $options: "i" } },
        ],
      });
      if (user.length >= 0) {
        res.status(200).json(user);
      } else {
        res.status(404).error({ message: "User not found." });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error." });
    }
  }
};

export const updateUser = async (req, res) => {
  const userId = res.locals.user._id;
  const data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    bio: req.body.bio,
  };
  if (req.file) {
    const outDatedData = await userModel.findOne({ _id: userId });
    const oldProfileImg = outDatedData.profileImg.public_id;
    if (oldProfileImg !== "qo4bnnmunbtain0qxinx") {
      const deleteImg = await deleteOnCloudinary(oldProfileImg);
      console.log(deleteImg);
    }
    const newImg = await uploadOnCloudinary(req.file.path);
    data.profileImg = {
      public_id: newImg.public_id,
      url: newImg.secure_url,
    };
    fs.unlinkSync(req.file.path);
  }
  const updateData = await userModel.findOneAndUpdate(userId, data);
};

export const deleteUser = async (req, res) => {
  try {
    const userId = res.locals.user._id;
    const username = res.locals.user.username;
    const profileImg = res.locals.user.profileImg.public_id;

    // Delete user document
    if (profileImg !== "qo4bnnmunbtain0qxinx") {
      await deleteOnCloudinary(profileImg);
    }
    await userModel.findOneAndDelete({ _id: userId });

    const allBlogs = await blogs.find({ author: username });
    if (allBlogs.length > 0) {
      const imageUrls = allBlogs.map((blog) => blog.img.public_id);
      await deleteBlogImages(imageUrls);
      await blogs.deleteMany({ author: username });
    }

    res.status(200).json({
      message: "Account closed.",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal error.",
    });
  }
};
async function deleteBlogImages(imageUrls) {
  try {
    if (imageUrls.length === 0) return;

    const deletionPromises = imageUrls.map((url) => deleteOnCloudinary(url));

    await Promise.allSettled(deletionPromises);
  } catch (error) {
    console.error("Error deleting blog images:", error);
    throw error;
  }
}
