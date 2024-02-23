import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// handle errors
const handleErrors = (err) => {
  
  if (err.message === "incorrect password") {
    return { message: "Minimum password length is 6 characters" };
  }
  if (err.code === 11000) {
    return { message: "email or username is already registered" };
  }
  if (err.message.includes("user validation failed")) {
    return { message: "email is invalid" };
  }
};

// creating json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await userModel.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json(errors);
  }
};

export const loginController = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "email does not exists" });
  }
  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const token = createToken(user._id);
      res.cookie("authToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
      return res.status(201).json({ user: user._id });
    } else {
      res.status(400).json({ message: "invalid credentails" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = handleValidationErrors(err);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = (req, res) => {
  res.cookie("authToken", "", { httpOnly: true, maxAge: 1 });
  res.redirect("/");
};
