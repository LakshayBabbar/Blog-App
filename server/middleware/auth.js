import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
export const checkUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new Error("No token provided.");
    }

    jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          return res.status(401).json({
            message: "Token is invalid or expired.",
          });
        }

        const user = await userModel.findById(decodedToken.id);
        if (!user) {
          throw new Error("User not found.");
        }

        res.locals.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Error in checkUser middleware:", error);
    res.locals.user = null;
    return res.status(401).json({
      message: "User is not authenticated.",
    });
  }
};
