import express from "express";
import { registerController, loginController } from "../controllers/userController.js";
import bodyParser from "body-parser";
import { uploadImage } from "../controllers/imageConroller.js";
import upload from '../middleware/upload.js';

const router = express.Router();
router.post("/register", bodyParser.json(), registerController);
router.post("/login", bodyParser.json(), loginController);
router.post("/file/upload", upload.single('file'), uploadImage);

export default router;

