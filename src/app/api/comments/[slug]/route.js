import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import commentModel from "@/models/commentModel";
import { connectDB } from "@/config/db";

export const GET = async (req, { params }) => {
  const blogId = params.slug;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    await connectDB();
    const comments = await commentModel.find({ blogId }).lean();
    if (!comments) {
      return NextResponse.json(
        {
          message: "This blog has no comments.",
        },
        { status: 404 }
      );
    }
    const sortedComments = await comments.map((item) => {
      return { ...item, isUser: item.userId === userId };
    });
    return NextResponse.json(sortedComments);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: error.message,
    });
  }
};
