import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { deleteMultipleImages } from "@/config/cloudinary";
import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import commentModel from "@/models/commentModel";
import userModel from "@/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const PUT = async (req, res) => {
  try {
    const reqBody = await req.json();
    const { name, bio } = reqBody;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!name || name.length < 3) {
      return NextResponse.json(
        { message: "Name must be at least 3 characters long", success: false },
        { status: 400 }
      );
    }
    await connectDB();
    await userModel.findOneAndUpdate(
      { _id: user?.id },
      {
        displayName: name,
        bio,
      }
    );
    return NextResponse.json(
      { message: "Profile Updated!", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};
export const DELETE = async (req, res) => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    // Delete user document
    await connectDB();
    if (user.isAdmin) {
      return NextResponse.json(
        {
          message: "Admin account can't delete.",
          success: false,
        },
        { status: 400 }
      );
    }
    await userModel.findOneAndDelete({ _id: user?.id });
    await commentModel.deleteMany({ userId: user?.id });
    const allBlogs = await blogs.find({ userId: user?.id });
    if (allBlogs.length > 0) {
      const imageUrls = allBlogs.map((blog) => blog.img.public_id);
      await deleteMultipleImages(imageUrls);
      await blogs.deleteMany({ userId: user?.id });
    }
    revalidatePath("/");
    return NextResponse.json(
      {
        message: "Account closed.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: "Internal error",
        success: false,
      },
      { status: 500 }
    );
  }
};
