import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg;

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
    displayName: {
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
      required: [true, "profile image is required"],
    },
    bio: {
      type: String,
      default: "Bio.",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;
