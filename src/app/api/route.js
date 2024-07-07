import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    return NextResponse.json({
      message: "Welcome to legit-blogs API",
      success: true,
    });
  } catch (error) {
    NextResponse.json({
      message: error.message,
      success: false,
    });
  }
};
