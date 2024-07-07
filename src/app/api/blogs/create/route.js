import { NextResponse } from "next/server";
import { uploadImage } from "@/config/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import blogs from "@/models/blogModel";
import { connectDB } from "@/config/db";
import { revalidatePath } from "next/cache";

export const POST = async (req) => {
  const data = await req.formData();
  const title = data.get("title");
  const description = data.get("description");
  const category = data.get("category");
  const img = data.get("img");
  const session = await getServerSession(authOptions);
  const user = session?.user;

  try {
    if (!img) {
      return NextResponse.json(
        {
          message: "Image is required",
        },
        { status: 400 }
      );
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB in bytes

    if (img.size > maxSizeInBytes) {
      return NextResponse.json(
        {
          message: "Image size should be less than 1 MB",
        },
        { status: 400 }
      );
    }

    const byteData = await img.arrayBuffer();
    const buffer = new Uint8Array(byteData);
    const cloudinaryRes = await uploadImage(buffer);
    if (!cloudinaryRes) {
      throw new Error("Failed to upload image to Cloudinary");
    }
    await connectDB();
    const newBlog = new blogs({
      title,
      description,
      category,
      img: {
        public_id: cloudinaryRes.public_id,
        url: cloudinaryRes.secure_url,
      },
      author: user?.username,
      userId: user?.id,
    });
    const createdBlog = await newBlog.save();
    await revalidatePath("/");
    return NextResponse.json(
      {
        ...createdBlog._doc,
        message: "Blog created successfully!",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.url === 1
    ) {
      return NextResponse.json(
        {
          message:
            "A blog with this title already exists. Please make some changes to the title.",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
