// app/api/import-holiday/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์ที่อัปโหลด" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    for (const row of sheet as any[]) {
        console.log("DATE:", row["DATE"], "REMARK:", row["REMARK"], "SUNDAY:", row["SUNDAY"]);
      const date = row.date || row["DATE"];
      const remark = row.remark || row["REMARK"];
      const sunday = row.sunday || row["SUNDAY"] || 0;

      if (date) {
        if(sunday === 'public') {
            await db.query(
          "INSERT IGNORE INTO holiday (date, remark, sunday) VALUES (?, ?, ?)",
          [date, remark, 0]
        );
        }else {
            await db.query(
          "INSERT IGNORE INTO holiday (date, remark, sunday) VALUES (?, ?, ?)",
          [date, remark, 1]
        );
        }
        
      }
    }

    return NextResponse.json({ message: "นำเข้าเรียบร้อยแล้ว" }, { status: 200 });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
