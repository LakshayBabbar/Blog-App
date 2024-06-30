import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";
import bodyParser from "body-parser";
import { checkUser } from "./middleware/auth.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userModel from "./models/userModel.js";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import session from "express-session";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [
  process.env.ORIGIN,
  "https://Legit-Blogs-delta.vercel.app",
];
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
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "legit_blogs_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userExist = await userModel.findOne({ googleId: profile.id });
        if (userExist) {
          return done(null, userExist);
        } else {
          const user = new userModel({
            googleId: profile.id,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            profileImg: profile.photos[0].value,
          });
          const savedUser = await user.save();
          return done(null, savedUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(router);

app.get("/", checkUser, (req, res) => {
  const user = res.locals.user;
  const response = {
    message: "Welcome to Legit-Blogs API",
    isLogedin: user ? true : false,
  };
  if (user) {
    response.username = user.username;
  }
  res.status(200).json(response);
});

const connectDB = async () => {
  try {
    console.log("Attempting to connect to the database...");

    await mongoose.connect(process.env.URI);

    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully.");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Error while connecting to database:", error.message);
      process.exit(1);
    });

    console.log("Database connection successful, starting the server...");
    app.listen(PORT, () => {
      console.log("Server is started on port:", PORT);
    });
  } catch (error) {
    console.error("Error in connectDB try-catch:", error.message);
  }
};
connectDB();
