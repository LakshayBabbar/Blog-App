import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
connectDB();
app.use(cors());
app.use(bodyParser.json());
app.use(userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Blog-Tech!",
  });
});

app.listen(PORT, () => {
  console.log("Server is started");
});
