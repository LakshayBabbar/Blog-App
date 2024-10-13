import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import reqModel from "@/models/reqModel";

export const POST = async (req) => {
  const { email, subject, message } = await req.json();

  try {
    await connectDB();

    if (!email && !subject && !message) {
      return NextResponse.json(
        {
          message: "Please fill in all fields",
          success: false,
        },
        { status: 400 }
      );
    }

    await reqModel.create({
      email,
      subject,
      message,
    });

    return NextResponse.json(
      {
        message: "Request submitted successfully",
        success: true,
      },
      { status: 201 }
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
