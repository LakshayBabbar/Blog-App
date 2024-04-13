import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from "validator";
import dotenv from "dotenv";
const { isEmail } = pkg;
dotenv.config();

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      lowercase: true,
    },
    firstname: {
      type: String,
      required: [true, "first name is required"],
    },
    lastname: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "incorrect password"],
    },
    profileImg: {
      public_id: {
        type: String,
        default: "qo4bnnmunbtain0qxinx",
      },
      url: {
        type: String,
        default: process.env.USER_IMAGE,
      },
    },
    bio: {
      type: String,
      default: "Bio.",
    },
  },
  { timestamps: true }
);

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const userModel = mongoose.model("user", userSchema);
export default userModel;
