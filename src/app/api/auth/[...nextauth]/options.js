import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.username = user.email.split("@")[0];
          await connectDB();
          const userExist = await userModel.findOne({ email: user.email });

          if (!userExist) {
            const newUser = new userModel({
              displayName: user.name,
              email: user.email,
              username: user.email.split("@")[0],
              profileImg: user.image,
              isAdmin: false,
            });
            const savedUser = await newUser.save();
            token.id = savedUser._id;
            token.isAdmin = false;
          } else {
            token.id = userExist._id;
            token.isAdmin = userExist.isAdmin;
          }
        }
        return token;
      } catch (error) {
        console.error("Error in JWT callback:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        session.user.username = token.username;
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },
  },
  events: {
    error: (message) => {
      console.error("NextAuth error:", message);
    },
  },
};

export default NextAuth(authOptions);
