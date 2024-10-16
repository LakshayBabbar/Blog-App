import blogs from "@/models/blogModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";

export const GET = async (req, { params }) => {
  try {
    const blogRef = params.slug;
    await connectDB();
    const blogData = await blogs.findOne({ url: blogRef }).lean();
    if (!blogData) {
      return NextResponse.json(
        {
          error: "Blog not found.",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(blogData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
};
