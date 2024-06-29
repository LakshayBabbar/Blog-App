import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const authentication = async (req, res, next) => {
  try {
    const token = await req.cookies.authToken;
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
    res.locals.user = null;
    return res.status(401).json({
      message: "User is not authenticated.",
    });
  }
};

// check current user
export const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      res.locals.user = null;
      return next();
    }

    jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
        } else {
          try {
            const user = await userModel.findById(decodedToken.id);
            if (!user) {
              res.locals.user = null;
            } else {
              res.locals.user = user;
            }
          } catch (error) {
            console.error("MongoDB error:", error.message);
            return res.status(500).json({
              message: "Internal server error.",
            });
          }
        }
        next();
      }
    );
  } catch (error) {
    console.error("Check user error:", error.message);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};
