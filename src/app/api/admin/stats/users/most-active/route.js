import { NextResponse } from "next/server";
import blogs from "@/models/blogModel";
import userModel from "@/models/userModel";
import { connectDB } from "@/config/db";

export async function GET(req) {
  try {
    await connectDB();

    const blogsCount = await blogs.aggregate([
      {
        $group: {
          _id: "$userId",
          blogsCreated: { $sum: 1 },
        },
      },
      { $sort: { blogsCreated: -1 } },
      { $limit: 10 },
    ]);

    const mostActiveUsers = await userModel.find({
      _id: { $in: blogsCount.map((entry) => entry._id) },
    });

    const result = blogsCount.map((blog) => {
      const user = mostActiveUsers.find((u) => u._id.equals(blog._id));
      return {
        userId: blog._id,
        blogsCreated: blog.blogsCreated,
        username: user?.username,
        displayName: user?.displayName,
        profileImg: user?.profileImg,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching most active users",
      },
      { status: 500 }
    );
  }
}
