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
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (blogData.userId !== user?.id) {
      return NextResponse.json(
        { error: "User is not authorized." },
        { status: 403 }
      );
    }

    const BlogImg = blogData.img.public_id;

    await Promise.all([
      deleteImage(BlogImg),
      commentModel.deleteMany({ blogId: blogId }),
      blogs.findOneAndDelete({ _id: blogId, userId: user?.id }),
    ]);

    revalidatePath("/");
    revalidatePath(`/blogs/${blogData.url}`);
    revalidatePath(`/category/${blogData.category}`);
    return NextResponse.json(
      {
        message: "Blog is deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const title = data.get("title");
    const description = data.get("description");
    const content = data.get("content");
    const img = data.get("img");

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedData = { title, description, content };

    await connectDB();

    const oldBlogData = await blogs.findOne({ _id: blogId, userId: user.id });
    if (!oldBlogData) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
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

    const updatedBlog = await blogs.findOneAndUpdate(
      { _id: blogId, userId: user.id },
      updatedData,
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Failed to update blog" },
        { status: 400 }
      );
    }

    revalidatePath(`/blogs/${updatedBlog.url}`);

    return NextResponse.json({ blog: updatedBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
