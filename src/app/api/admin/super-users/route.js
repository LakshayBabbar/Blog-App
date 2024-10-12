export const revalidate = 0;

import { NextResponse } from "next/server";
import userModel from "@/models/userModel";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const GET = async (req, res) => {
  try {
    const superUsers = await userModel.find({ isSuper: true });
    return NextResponse.json({ users: superUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
};

export const PUT = async (req, res) => {
  const { email, status } = await req.json();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized, Only Admin have the access" },
      { status: 401 }
    );
  }

  if (status !== "add" && status !== "remove") {
    return NextResponse.json(
      { message: "Invalid status", success: false },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { message: "Email is required", success: false },
      { status: 400 }
    );
  }

  try {
    const userExists = await userModel.findOne({ email });
    if (!userExists || userExists?.blocked) {
      return NextResponse.json(
        { message: "User not found or blocked", success: false },
        { status: 404 }
      );
    }
    if (status === "add") {
      await userModel.findOneAndUpdate({ email }, { isSuper: true });
      return NextResponse.json(
        { message: "User added to Super Users", success: true },
        { status: 200 }
      );
    }
    await userModel.findOneAndUpdate({ email }, { isSuper: false });
    revalidatePath("/admin/super-users");
    return NextResponse.json(
      { message: "User removed from Super Users", success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
