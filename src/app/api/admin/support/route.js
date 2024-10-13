export const revalidate = 0;

import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import reqModel from "@/models/reqModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = async (req) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user.isAdmin && !user.isSuper) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const requests = await reqModel.find({});

    return NextResponse.json(
      {
        requests,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user.isAdmin && !user.isSuper) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }
  const { id } = await req.json();

  try {
    await connectDB();

    await reqModel.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Request deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
};
