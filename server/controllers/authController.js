import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// handle errors
const handleErrors = (err) => {
  if (err.message.includes("incorrect password")) {
    return { message: "Minimum password length is 6 characters" };
  }
  if (err.code === 11000) {
    return { message: "email or username is already registered" };
  }
  if (err.message.includes("is required")) {
    return { message: "Please fill up all fields." };
  }
  if (err.message.includes("user validation failed")) {
    return { message: "email is invalid" };
  }
};

// creating json web token
const maxAge = 7 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

export const registerController = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const username = email.split("@")[0];
  try {
    const supportedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format.",
        success: false,
      });
    }
    const domain = email.split("@")[1];
    if (!supportedDomains.includes(domain)) {
      return res.status(403).json({
        message: `Only ${supportedDomains.join(
          ", "
        )} are supported email providers`,
        success: false,
      });
    }
    const newUser = await userModel.create({
      username,
      firstname,
      lastname,
      email,
      password,
      bio: `Hey I'm ${firstname}`,
    });
    const authToken = createToken(newUser._id, username);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires,
    });
    res.status(201).json({
      message: "User is registered successfully",
      username,
      success: true,
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ ...errors, success: false });
  }
};

export const loginController = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "email does not exists", success: false });
  }
  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const token = createToken(user._id, user.username);
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        expires,
      });
      return res.status(201).json({
        user: user._id,
        username: user.username,
        authToken: token,
        message: "Login Successfully!",
        success: true,
      });
    } else {
      res.status(401).json({ message: "invalid credentails", success: false });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = handleValidationErrors(err);
      return res.status(400).json({ ...errors, success: false });
    }
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
export const logoutController = (req, res) => {
  try {
    res.cookie("authToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(0),
    });
    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
