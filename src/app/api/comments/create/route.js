import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import blogs from "@/models/blogModel";
import commentModel from "@/models/commentModel";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";

export const POST = async (req) => {
  const reqBody = await req.json();
  const { blogId, description } = await reqBody;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    await connectDB();
    const isValidUsr = await userModel.findOne({ _id: user?.id });
    if (!isValidUsr || isValidUsr?.blocked) {
      return NextResponse.json(
        {
          error: "User not found or blocked",
        },
        { status: 404 }
      );
    }
    const blog = await blogs.findOne({ _id: blogId });
    if (!blog) {
      return NextResponse.json(
        {
          error: "Blog not found.",
        },
        { status: 404 }
      );
    }
    const newComment = await commentModel.create({
      blogId,
      userId: user?.id,
      username: user?.username,
      description,
    });
    if (!newComment) {
      throw new Error("Error while adding comment.");
    }
    return NextResponse.json(
      {
        message: "Comment created successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
};
