import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import commentModel from "@/models/commentModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import { deleteImage, uploadImage } from "@/config/cloudinary";
import { revalidatePath } from "next/cache";

export const DELETE = async (req, { params }) => {
  const blogId = params.slug;
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    connectDB();
    const blogData = await blogs.findOne({ _id: blogId });
    if (!blogData) {
      return NextResponse.json(
        { message: "Blog not found", success: false },
        { status: 404 }
      );
    }

    if (blogData.userId !== user?.id) {
      return NextResponse.json(
        { message: "User is not authorized.", success: false },
        { status: 403 }
      );
    }

    const BlogImg = blogData.img.public_id;
    await deleteImage(BlogImg);
    await commentModel.deleteMany({ blogId: blogId });
    await blogs.findOneAndDelete({
      _id: blogId,
      userId: user?.id,
    });
    await revalidatePath("/");
    revalidatePath(`/blogs/${blogData.url}`);
    return NextResponse.json(
      {
        message: "Blog is deleted successfully.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  const blogId = params.slug;

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const data = await req.formData();
    const title = data.get("title");
    const description = data.get("description");
    const content = data.get("content");
    const img = data.get("img");
    const featured = data.get("featured") === "true";
    const category = data.get("category");

    if (!title || !description || !content) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const updatedData = { title, description, content };

    await connectDB();

    const oldBlogData = await blogs.findOne({ _id: blogId, userId: user.id });
    if (!oldBlogData) {
      return NextResponse.json(
        { message: "Blog not found", success: false },
        { status: 404 }
      );
    }

    if (img) {
      const outdatedImg = oldBlogData.img?.public_id;
      if (outdatedImg) {
        await deleteImage(outdatedImg);
      }

      const byteData = await img.arrayBuffer();
      const buffer = new Uint8Array(byteData);
      const newImg = await uploadImage(buffer);

      if (!newImg) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      updatedData.img = {
        public_id: newImg.public_id,
        url: newImg.secure_url,
      };
    }

    if (featured) {
      updatedData.featured = featured;
      await blogs.updateOne(
        { featured: true, category },
        { $set: { featured: false } }
      );
    }

    const updatedBlog = await blogs.findOneAndUpdate(
      { _id: blogId, userId: user.id },
      updatedData,
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { message: "Failed to update blog", success: false },
        { status: 500 }
      );
    }

    await revalidatePath(`/blogs/${updatedBlog.url}`);

    return NextResponse.json(
      { blog: updatedBlog, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
};
