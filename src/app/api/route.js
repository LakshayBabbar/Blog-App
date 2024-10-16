import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  try {
    return NextResponse.json({
      message: "Welcome to legit-blogs API",
    });
  } catch (error) {
    NextResponse.json({
      error: error.message,
    });
  }
};
