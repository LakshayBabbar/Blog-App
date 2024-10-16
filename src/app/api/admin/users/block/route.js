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
    return NextResponse.json({ blockedusers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req, res) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { userId } = await req.json();

  if (!user || (!user.isAdmin && !user.isSuper)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.id === userId) {
    return NextResponse.json(
      {
        error: "You cannot be block yourself",
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
            error: "Super Users cannot block Admins",
          },
          { status: 400 }
        );
      }
      if (isRegularUser.isSuper === true) {
        return NextResponse.json(
          {
            error: "Only Admin can block Super Users",
          },
          { status: 400 }
        );
      }
    }

    if (user.isAdmin !== true && user.isSuper !== true) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userblogs = await blogs.find({ userId });
    const imageUrls = userblogs.map((blog) => blog.img.public_id);
    const blogIds = userblogs.map((blog) => blog._id);
    const categories = [...new Set(userblogs.map((blog) => blog.category))];
    const blogUrls = userblogs.map((blog) => blog.url);

    await Promise.all([
      deleteMultipleImages(imageUrls),
      blogs.deleteMany({ userId }),
      commentModel.deleteMany({
        $or: [{ userId: user?.id }, { blogId: { $in: blogIds } }],
      }),
      userModel.findOneAndUpdate({ _id: userId }, { blocked: true }),
    ]);

    // revalidate all the categories and blog urls
    const revalidatePromises = [
      ...categories.map((category) => revalidatePath(`/category/${category}`)),
      ...blogUrls.map((url) => revalidatePath(url)),
      revalidatePath("/"),
    ];
    await Promise.all(revalidatePromises);

    return NextResponse.json({ message: "Account Suspended" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
