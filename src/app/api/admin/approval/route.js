export const revalidate = 0;

import { NextResponse } from "next/server";
import blogs from "@/models/blogModel";
import { connectDB } from "@/config/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async (req) => {
  try {
    await connectDB();
    const allBlogs = await blogs.find({ approved: false });
    return NextResponse.json({ blogs: allBlogs });
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const reqBody = await req.json();
    const { blogId, status } = await reqBody;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    await connectDB();
    if (user.isAdmin || user.isSuper) {
      if (status === "reject") {
        await blogs.findByIdAndDelete(blogId);
        return NextResponse.json({ message: "Blog rejected" }, { status: 200 });
      }
      await blogs.findByIdAndUpdate(blogId, { approved: true }, { new: true });
      revalidatePath("/");
      revalidatePath("/admin/approval");
      return NextResponse.json({ blog: updatedBlog });
    }
    return NextResponse.json(
      {
        message: "You are not authorized to approve blogs",
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 400 }
    );
  }
};
