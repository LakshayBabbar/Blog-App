import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
  const skip = (page - 1) * limit;

  try {
    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    await connectDB();
    const countDocuments = await blogs.countDocuments(filter);
    const blogData = await blogs
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title url img author createdAt category");
    return NextResponse.json(
      {
        blogs: blogData,
        totalPages: Math.ceil(countDocuments / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching blogs", error },
      { status: 500 }
    );
  }
};
