import mongoose from "mongoose";
import pkg from "validator";
import dotenv from "dotenv";
const { isEmail } = pkg;
dotenv.config();

const userSchema = mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      lowercase: true,
      unique: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
      unique: true,
    },
    profileImg: {
      type: String,
    },
    bio: {
      type: String,
      default: "Bio.",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
