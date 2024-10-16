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
          error: "Invalid comment ID.",
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
          error: "Comment not found.",
        },
        { status: 404 }
      );
    }
    if (user?.id !== comment.userId.toString()) {
      return NextResponse.json(
        {
          error: "User is not authorised.",
        },
        { status: 401 }
      );
    }
    await commentModel.findByIdAndDelete(commentObjectId);
    return NextResponse.json(
      {
        message: "Comment deleted successfully.",
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
