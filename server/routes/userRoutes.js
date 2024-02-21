import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { registerController } from "../controllers/userController.js";
import { loginController } from "../controllers/userController.js";

const router = express.Router();
router.get("/all-users", getAllUsers);
router.post("/register", registerController);
router.post("/login", loginController);

export default router;
