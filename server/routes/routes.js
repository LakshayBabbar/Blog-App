import express from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/authController.js";
import { imageController } from "../controllers/imageConroller.js";
import upload from "../middleware/multer.js";

const router = express.Router();
router.post("/signup", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/file/upload", upload.single("file"), imageController);

export default router;
