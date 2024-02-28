import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// handle errors
const handleErrors = (err) => {
  console.log(err.code, err.message);
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
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

export const registerController = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  const profileImg =
    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1708933835~exp=1708934435~hmac=8d744b768cf5da502f05ff8fc278a4cae919a6904ad6905ec3b8ce33854e4bd3";

  try {
    await userModel.create({
      username,
      firstname,
      lastname,
      email,
      password,
      profileImg,
    });
    res.status(201).json({
      success: "true",
      message: "User is created successfully",
    });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json(errors);
  }
};

export const loginController = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "email does not exists" });
  }
  try {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (isValid) {
      const token = createToken(user._id);
      return res.status(201).json({ user: user._id, authToken: token });
    } else {
      res.status(401).json({ message: "invalid credentails" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = handleValidationErrors(err);
      return res.status(400).json({ errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
