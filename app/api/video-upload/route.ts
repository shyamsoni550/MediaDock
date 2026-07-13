import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 300000, // Set timeout to 60 seconds (60000 milliseconds)
});

interface CloudinaryUploadResult {
  public_id: string;
  bytes: number;
  duration?: number;
  eager?: {
    bytes?: number;
    secure_url?: string;
  }[];
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary configuration is missing" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const originalSize = formData.get("originalSize") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_chunked_stream(
          {
            resource_type: "video",
            folder: "Video-uploads",
            chunk_size: 6_000_000,
            timeout: 600000,
            eager_async: false,
            eager: [
              {
                width: 1280,
                height: 720,
                crop: "limit",
                quality: "auto:eco",
                format: "mp4",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Cloudinary upload failed"));
              return;
            }

            resolve({
              public_id: result.public_id,
              bytes: result.bytes,
              duration: result.duration,
              eager: result.eager,
            });
          },
        );

        uploadStream.end(buffer);
      },
    );
    const optimizedBytes = result.eager?.[0]?.bytes ?? result.bytes;
    const video = await prisma.video.create({
      data: {
        title: title || "Untitled",
        description: description || "",
        publicId: result.public_id,
        orignalSize: originalSize || file.size.toString(),
        compressedSize: optimizedBytes.toString(),
        duration: (result.duration || 0).toString(),
      },
    });

    return NextResponse.json({ video }, { status: 200 });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 },
    );
  }
}
