import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const username = params.slug;
    await connectDB();
    const userDetails = await userModel.findOne({ username }).lean();

    if (!userDetails) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }
    const userBlogs = await blogs
      .find({ userId: userDetails._id })
      .sort({ updatedAt: -1 });

    return NextResponse.json(
      {
        ...userDetails,
        blogs: userBlogs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
