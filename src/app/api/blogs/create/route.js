import { NextResponse } from "next/server";
import { uploadImage } from "@/config/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import blogs from "@/models/blogModel";
import { connectDB } from "@/config/db";
import { revalidatePath } from "next/cache";
import userModel from "@/models/userModel";

export const POST = async (req) => {
  try {
    const data = await req.formData();
    const title = data.get("title");
    const description = data.get("description");
    const content = data.get("content");
    const category = data.get("category");
    const img = data.get("img");

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const user = session?.user;
    const sudoUser = await userModel.findById(user.id);

    if (!content || !description || !title || !category || !img) {
      return NextResponse.json(
        { error: "All fields are required, including image" },
        { status: 400 }
      );
    }

    if (sudoUser?.blocked) {
      return NextResponse.json(
        { error: "You are blocked by admin" },
        { status: 403 }
      );
    }

    const maxSizeInBytes = 1 * 1024 * 1024;
    if (img.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: "Image size must be less than 1MB" },
        { status: 400 }
      );
    }

    await connectDB();

    let cloudinaryRes;
    try {
      const byteData = await img.arrayBuffer();
      const buffer = new Uint8Array(byteData);
      cloudinaryRes = await uploadImage(buffer);
      if (!cloudinaryRes) {
        throw new Error("Failed to upload image to Cloudinary");
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Image upload failed" },
        { status: 500 }
      );
    }

    const newBlog = new blogs({
      title,
      description,
      content,
      category,
      img: {
        public_id: cloudinaryRes.public_id,
        url: cloudinaryRes.secure_url,
      },
      author: user?.username,
      userId: user?.id,
    });

    if (sudoUser?.isAdmin || sudoUser?.isSuper) {
      newBlog.approved = true;
    }

    const createdBlog = await newBlog.save();

    revalidatePath("/");
    revalidatePath(`/category/${category}`);
    revalidatePath(`/blogs/${createdBlog.url}`);

    return NextResponse.json(
      { ...createdBlog._doc, message: "Blog created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.url === 1) {
      return NextResponse.json(
        { error: "A blog with this title already exists." },
        { status: 400 }
      );
    }

    console.error("Error creating blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
