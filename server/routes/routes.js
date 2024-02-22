import express from "express";
import {
  registerController,
  loginController,
} from "../controllers/userController.js";
import { imageController } from "../controllers/imageConroller.js";
import upload from "../middleware/multer.js";

const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/file/upload", upload.single("file"), imageController);

export default router;
