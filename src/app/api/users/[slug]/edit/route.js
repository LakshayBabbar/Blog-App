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
        { error: "Name must be at least 3 characters long" },
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
    return NextResponse.json({ message: "Profile Updated!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, res) => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    await connectDB();

    const validUser = await userModel.findById(user?.id);

    if (!validUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    if (validUser.isAdmin || validUser.isSuper) {
      return NextResponse.json(
        {
          error: "Admin or super user account can't be deleted.",
        },
        { status: 400 }
      );
    }

    const userBlogs = await blogs.find({ userId: user?.id });

    const blogIds = userBlogs.map((blog) => blog._id);
    const imageUrls = userBlogs.map((blog) => blog.img.public_id);
    const categories = [...new Set(userBlogs.map((blog) => blog.category))];
    const urls = userBlogs.map((blog) => `/blog/${blog.url}`);

    await Promise.all([
      userModel.findByIdAndDelete(user?.id),
      commentModel.deleteMany({
        $or: [{ userId: user?.id }, { blogId: { $in: blogIds } }],
      }),
      deleteMultipleImages(imageUrls),
      blogs.deleteMany({ userId: user?.id }),
    ]);

    const revalidatePromises = [
      ...categories.map((category) => revalidatePath(`/category/${category}`)),
      ...urls.map((url) => revalidatePath(url)),
      revalidatePath("/"),
    ];
    await Promise.all(revalidatePromises);

    return NextResponse.json(
      {
        message: "Account and related content successfully deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error.",
        details: error.message,
      },
      { status: 500 }
    );
  }
};
