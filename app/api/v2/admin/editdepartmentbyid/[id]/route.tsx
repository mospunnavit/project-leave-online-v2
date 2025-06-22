import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ไข 1: เพิ่ม Promise
) {
  const { id } = await params; // ✅ แก้ไข 2: await params แล้ว destructure
  const departmentId = parseInt(id); // ✅ แก้ไข 3: ไม่ต้อง await parseInt
  const body = await req.json();
  const { department_code, department_name } = body;

  try {
        await db.query(
    `UPDATE departments SET department_code = ?, department_name = ? WHERE id = ?`,
    [department_code, department_name, departmentId]
  );
    return NextResponse.json({ success: true });
  }catch (err) {
      console.log(err);
  }
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   
}