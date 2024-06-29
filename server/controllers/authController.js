import jwt from "jsonwebtoken";
import dontenv from "dotenv";
dontenv.config();

const maxAge = 7 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: maxAge,
  });
};

export const googleAuth = async (req, res) => {
  try {
    if (req.user) {
      const token = createToken(req.user._id, req.user.username);
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        path: "/",
        expires,
      });
      return res
        .status(201)
        .redirect(process.env.ORIGIN + `/users/${req.user.username}`);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const logoutController = async (req, res) => {
  try {
    res.cookie("authToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(0),
    });
    return res
      .status(200)
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
