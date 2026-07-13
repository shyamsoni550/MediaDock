import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      message: "Videos fetched successfully",
      videos,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching videos", error },
      { status: 500 },
    );
  }
}
