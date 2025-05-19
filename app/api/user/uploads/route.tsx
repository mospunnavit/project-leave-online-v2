import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "login" }, { status: 400 });
    }
  try {
    console.log("Content-Type:", req.headers.get("content-type"));
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // สร้างชื่อไฟล์ใหม่ตาม timestamp + นามสกุลเดิม
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName); // .png, .jpg, .pdf etc.
    const newFilename = `upload_${session?.user?.username}${timestamp}${extension}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", newFilename);

    await writeFile(uploadPath, buffer);

    return NextResponse.json({
      message: "Upload success",
      path: `${newFilename}`,
    }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      message: "Failed",
      error: (error as Error).message || "Unknown error",
    }, { status: 500 });
  }
}
