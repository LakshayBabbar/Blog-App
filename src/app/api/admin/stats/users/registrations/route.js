export const revalidate = 0;

import { connectDB } from "@/config/db";
import userModel from "@/models/userModel";
import { startOfMonth, subMonths, format } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectDB();
    const now = new Date();
    const last12Months = Array.from({ length: 12 }).map((_, index) => {
      const date = subMonths(now, index);
      return {
        start: startOfMonth(date),
        label: format(date, "MMM yyyy"),
      };
    });

    const userRegistrations = await Promise.all(
      last12Months.map(async (month) => {
        const count = await userModel.countDocuments({
          createdAt: {
            $gte: month.start,
            $lt: subMonths(month.start, -1),
          },
        });

        return {
          month: month.label,
          count,
        };
      })
    );

    return NextResponse.json(userRegistrations.reverse(), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user registrations" },
      { status: 500 }
    );
  }
}
