import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    connectDB();
    const topCategories = await blogs.aggregate([
      { $group: { _id: "$category", blogCount: { $sum: 1 } } },
      { $sort: { blogCount: -1 } },
    ]);

    return NextResponse.json(topCategories);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
