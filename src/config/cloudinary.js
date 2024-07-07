import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, 
});

export const uploadImage = async (buffer) => {
  try {
    const imgPath = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "legit-blogs", secure: true },
          function (error, result) {
            if (error) {
              reject(error);
              return NextResponse.json(
                {
                  message: `Error while uploading image: ${error.message}`,
                  success: false,
                },
                { status: 400 }
              );
            }
            resolve(result);
          }
        )
        .end(buffer);
    });
    return imgPath;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: `Error while uploading image: ${error.message}`,
        success: false,
      },
      { status: 500 }
    );
  }
};

export const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: `Error while deleting image: ${error.message}`,
        success: false,
      },
      { status: 500 }
    );
  }
};
