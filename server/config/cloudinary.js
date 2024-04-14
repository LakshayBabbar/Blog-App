import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadOnCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          console.error("Error uploading image:", error);
          reject("Failed to upload image");
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      })
      .end(file.buffer);
  });
};

export const deleteOnCloudinary = async (id) => {
  try {
    if (!id) {
      return null;
    }
    const response = await cloudinary.uploader.destroy(id);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
