import { NextResponse } from "next/server";
import db from "@/lib/db"; // <-- ปรับตามที่คุณตั้งไว้
import { parse } from "csv-parse/sync";
import bcrypt from "bcryptjs";
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
        employee_id,
        password,
        fullname,
        department_id,
        is_active,
        has_license
      ] = row;
      console.log(id, created_at, updated_at, deleted_at, employee_id, password, fullname, department_id, is_active, has_license);
      
      if( department_id === 'department_id'){
        continue
      }else{
       console.log(fullname.split(' ')[0], fullname.split(' ')[1], department_id, employee_id, bcrypt.hash(employee_id, 10));
       const hash_password = await bcrypt.hash(employee_id, 10)
        await db.query(
          `INSERT INTO users (id, firstname ,lastname, department,username, password) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [id, fullname.split(' ')[0], fullname.split(' ')[2], department_id, employee_id, hash_password]
        )
        
      }
      
    }

  
    return NextResponse.json({ success: true, rows: records.length }, { status: 200 });
  } catch (err) {
    console.error("CSV import error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
