import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  try {
    await connectDB();
    const searchTerm = searchParams.get("term") || "";
    const blogData = await blogs
      .find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { author: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .select("title url updatedAt");
    if (!blogData) {
      return NextResponse.json(
        { message: "No blogs found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { blogs: blogData, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
};
