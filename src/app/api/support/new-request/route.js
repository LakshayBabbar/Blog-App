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
          error: "Please fill in all fields",
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
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
