import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const storage = new GridFsStorage({
  url: process.env.URI,
  options: { useNewUrlParser: true },
  file: (req, file) => {
    const type = ["image/png", "image/jpg", "image/jpeg"];
    if (type.indexOf(file.mimetype) === -1) {
      return `${Date.now()}-blog-${file.originalname}`;
    }
    return {
      bucketName: "photos",
      filename: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
