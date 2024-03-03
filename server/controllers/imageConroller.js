import {uploadOnCloudinary} from "../config/cloudinary.js";

export const imageController = async (req, res) => {
  try {
    console.log(req.file)
    res.send("hello");
  } catch (error) {
    res.send(error);
  }
};
