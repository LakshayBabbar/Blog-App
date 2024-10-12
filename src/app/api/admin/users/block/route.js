export const revalidate = 0;

import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import blogs from "@/models/blogModel";
import { deleteMultipleImages } from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import commentModel from "@/models/commentModel";

export const GET = async (req, res) => {
  try {
    connectDB();
    const blockedusers = await userModel.find({ blocked: true });
    return NextResponse.json({ blockedusers, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PUT = async (req, res) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { userId } = await req.json();

  if (!user || (!user.isAdmin && !user.isSuper)) {
    return NextResponse.json(
      { message: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  if (user.id === userId) {
    return NextResponse.json(
      {
        message: "You cannot be block yourself",
        success: false,
      },
      { status: 400 }
    );
  }
  try {
    connectDB();

    if (user.isSuper === true) {
      const isRegularUser = await userModel.findOne({
        _id: userId,
      });
      if (isRegularUser.isAdmin === true) {
        return NextResponse.json(
          {
            message: "Super Users cannot block Admins",
            success: false,
          },
          { status: 400 }
        );
      }
      if (isRegularUser.isSuper === true) {
        return NextResponse.json(
          {
            message: "Only Admin can block Super Users",
            success: false,
          },
          { status: 400 }
        );
      }
    }

    if (user.isAdmin !== true && user.isSuper !== true) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const userblogs = await blogs.find({ userId });
    if (userblogs.length > 0) {
      const imageUrls = userblogs.map((blog) => blog.img.public_id);
      await deleteMultipleImages(imageUrls);
      await blogs.deleteMany({ userId });
    }

    await commentModel.deleteMany({ userId });
    await userModel.findOneAndUpdate({ _id: userId }, { blocked: true });
    revalidatePath("/");
    return NextResponse.json(
      { message: "User blocked", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
