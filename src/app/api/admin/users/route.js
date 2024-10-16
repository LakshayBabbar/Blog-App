export const revalidate = 0;

import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("search")?.toLowerCase() || "all";
  await connectDB();
  if (searchTerm === "all") {
    const users = await userModel.find({});
    return NextResponse.json({ users }, { status: 200 });
  } else {
    try {
      const user = await userModel.find({
        $or: [
          { firstname: { $regex: searchTerm, $options: "i" } },
          { lastname: { $regex: searchTerm, $options: "i" } },
          { username: { $regex: searchTerm, $options: "i" } },
        ],
      });
      if (user.length >= 0) {
        return NextResponse.json({ users: user }, { status: 200 });
      } else {
        return NextResponse.error(
          {
            error: "User not found.",
          },
          { status: 404 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: "Internal error." }, { status: 500 });
    }
  }
};
