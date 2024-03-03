import express from "express";
import blogs from "../models/blogModel.js";
import userModel from "../models/userModel.js";
import { checkUser } from "../middleware/auth.js";

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

export default userRouter;
