import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";
import bodyParser from "body-parser";
import { checkUser } from "./middleware/auth.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [process.env.ORIGIN];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use(express.static("./uploads"));

app.get("/", checkUser, (req, res) => {
  const user = res.locals.user;
  const response = {
    message: "Welcome to Blog-Tech!",
    isLogedin: user ? true : false,
  };
  if (user) {
    response.username = user.username;
  }
  res.status(200).json(response);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("connected to database successfully.");
    app.listen(PORT, () => {
      console.log("Server is started");
    });
  } catch (error) {
    console.log(error);
  }
};
connectDB();
