import { NextResponse } from "next/server";
import db from "@/lib/db"; // <-- ปรับตามที่คุณตั้งไว้
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const text = Buffer.from(arrayBuffer).toString("utf-8");

    // Parse CSV (ไม่มี header)
    const records = parse(text, {
      columns: false, // เพราะไม่มี header
      skip_empty_lines: true,
      trim: true,
    });

    // Loop insert ทีละแถว
    for (const row of records) {
      const [
        id,
        created_at,
        updated_at,
        deleted_at,
        name,
        shortly
      ] = row;
      console.log(id, created_at, updated_at, deleted_at, name, shortly);
      console.log(typeof parseInt(id), typeof created_at, typeof updated_at, typeof deleted_at, typeof name, typeof shortly);
      if( shortly === 'shortly'){
        continue
      }else{
        await db.query(
        "INSERT into departments (id, department_code, department_name, department_name_thai) VALUES (?, ?, ?, ?)",
        [parseInt(id), shortly, shortly, name]
      )
      }
      
    }

  
    return NextResponse.json({ success: true, rows: records.length }, { status: 200 });
  } catch (err) {
    console.error("CSV import error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
