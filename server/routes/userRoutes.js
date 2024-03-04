import express from "express";
import blogs from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import { authentication, checkUser } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import {
  uploadOnCloudinary,
  deleteOnCloudinary,
} from "../config/cloudinary.js";
import fs from "node:fs";

const userRouter = express.Router();

userRouter.get("/users/:id", checkUser, async (req, res) => {
  try {
    const user = req.params["id"];
    const username = res.locals.username;
    const userDetails = await userModel.findOne({ username: user });

    const userBlogs = await blogs.find({ author: user });
    return res.status(200).json({
      user: userDetails,
      blogs: userBlogs,
      auth: user === username ? true : false,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/get-users/:username", async (req, res) => {
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

userRouter.put(
  "/update-user/",
  authentication,
  upload.single("img"),
  async (req, res) => {
    const userId = res.locals.user._id;
    const data = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      bio: req.body.bio,
    };
    if (req.file) {
      const outDatedData = await userModel.findOne({ _id: userId });
      const oldProfileImg = outDatedData.profileImg.public_id;
      if (oldProfileImg !== "uyrlwjrggqh38pmejv1f") {
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
  }
);

export default userRouter;
