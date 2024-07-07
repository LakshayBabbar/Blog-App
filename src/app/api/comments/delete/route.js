import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectDB } from "@/config/db";
import commentModel from "@/models/commentModel";
import mongoose from "mongoose";

export const DELETE = async (req) => {
  const { commentId } = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return NextResponse.json(
        {
          message: "Invalid comment ID.",
          success: false,
        },
        { status: 400 }
      );
    }
    const commentObjectId = new mongoose.Types.ObjectId(commentId);
    const comment = await commentModel.findOne({
      _id: commentObjectId,
    });
    if (!comment) {
      return NextResponse.json(
        {
          message: "Comment not found.",
          success: false,
        },
        { status: 404 }
      );
    }
    if (user?.id !== comment.userId.toString()) {
      return NextResponse.json(
        {
          message: "User is not authorised.",
          success: false,
        },
        { status: 401 }
      );
    }
    await commentModel.findByIdAndDelete(commentObjectId);
    return NextResponse.json(
      {
        message: "Comment deleted successfully.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
};
