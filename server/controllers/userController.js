import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import token from "../models/token.js";

dotenv.config();

export const registerController = async (req, res) => {
  const user = await userModel.find({ username: req.username });
  console.log(user)
  if (!user) {
    return res.status(403).json({
      message: "user already exists",
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };
      const newUser = await new userModel(userData);
      newUser.save();
      return res.status(200).json({
        success: true,
        message: "User is registered succesfully",
      });
    } catch (error) {
      console.log("There is an internal error!");
      return res.status(500);
    }
  }
};

export const loginController = async (req, res) => {
  const user = await userModel.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: "username does not exists" });
  }
  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const accessToken = jwt.sign(
        user.toJSON(),
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const refershToken = jwt.sign(
        user.toJSON(),
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const newToken = await new token({ token: refershToken });
      await newToken.save();
      return res
        .status(200)
        .json({ accessToken, refershToken, username: user.username });
    } else {
      res.status(400).json({ message: "username or password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "There is an internal error" });
  }
};
