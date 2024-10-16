import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 9);
  const skip = (page - 1) * limit;

  try {
    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    await connectDB();

    const featuredBlog = await blogs
      .findOne({ featured: true, category })
      .select("-content -__v -updatedAt -userId");

    if (featuredBlog) {
      filter._id = { $ne: featuredBlog._id };
    }
    filter.approved = true;
    const countDocuments = await blogs.countDocuments(filter);
    const blogData = await blogs
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content -__v -updatedAt -userId");

    if (!blogData || (blogData.length === 0 && !featuredBlog)) {
      return NextResponse.json({ error: "No blogs found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        blogs: blogData,
        featured: featuredBlog || null,
        totalPages: Math.ceil(countDocuments / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
