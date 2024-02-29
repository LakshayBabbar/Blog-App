import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";
import bodyParser from "body-parser";
/* import fileUpload from "express-fileupload"; */

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
connectDB();
app.use(cors());
app.use(bodyParser.json());
/* app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
  useTempFiles: true,
})); */
app.use(routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Blog-Tech!",
  });
});

app.listen(PORT, () => {
  console.log("Server is started");
});
