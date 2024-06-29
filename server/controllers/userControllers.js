import blogs from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";
import userModel from "../models/userModel.js";
import { deleteOnCloudinary } from "../config/cloudinary.js";

export const getUserDetails = async (req, res) => {
  try {
    const user = req.params["id"];
    const auth = res.locals.user;
    const userDetails = await userModel.findOne({ username: user }).lean();

    if (!userDetails) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    const userBlogs = await blogs.find({ author: user }).sort({ likes: -1 });
    const response = {
      ...userDetails,
      blogs: userBlogs,
      auth: false,
    };
    if (auth && user === auth.username) {
      response.auth = true;
    }
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllUsers = async (req, res) => {
  const ref = req.query["search"].toLowerCase() || "all";
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
  try {
    const { _id: userId } = res.locals.user;
    const data = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
    };
    await userModel.findOneAndUpdate(userId, data);
    return res.status(200).json({ message: "Profile Updated!", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id: userId, username } = res.locals.user;
    // Delete user document
    await userModel.findOneAndDelete({ _id: userId });
    await commentModel.deleteMany({ userId });
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
