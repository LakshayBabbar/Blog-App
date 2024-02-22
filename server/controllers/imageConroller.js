import uploadOnCloudinary from "../utils/cloudinary.js";

export const imageController = async (req, res) => {
  try {
    console.log(req.file)
    res.send("hello");
  } catch (error) {
    res.send(error);
  }
};
