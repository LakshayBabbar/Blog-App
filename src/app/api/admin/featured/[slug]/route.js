export const revalidate = 0;

import { connectDB } from "@/config/db";
import blogs from "@/models/blogModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { category } = await req.json();
  try {
    await connectDB();
    if (!user.isAdmin && !user.isSuper) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await blogs.updateOne(
      { featured: true, category },
      { $set: { featured: false } }
    );
    await blogs.updateOne({ _id: params.slug }, { $set: { featured: true } });
    revalidatePath(`/category/${category}`);
    revalidatePath("/");
    return NextResponse.json({ message: "Feature status updated" });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
