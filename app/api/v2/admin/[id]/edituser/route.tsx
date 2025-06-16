import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ไข 1: เพิ่ม Promise
) {
  const { id } = await params; // ✅ แก้ไข 2: await params แล้ว destructure
  const userId = parseInt(id); // ✅ แก้ไข 3: ไม่ต้อง await parseInt
  const body = await req.json();
  const { username, firstname, lastname, role, departments, department } = body;

  // 1. อัปเดต user
  await db.query(
    `UPDATE users SET username = ?, firstname = ?, lastname = ?, role = ?, department = ? WHERE id = ?`,
    [username, firstname, lastname, role, department, userId]
  );

  // 2. ลบแผนกเก่า
  await db.query(`DELETE FROM user_departments WHERE user_id = ?`, [userId]);

  // 3. เพิ่มแผนกใหม่
  const values = departments.map((deptId: string) => [userId, parseInt(deptId)]);
  if (values.length > 0) {
    await db.query(`INSERT INTO user_departments (user_id, department_id) VALUES ?`, [values]);
  }

  return NextResponse.json({ success: true });
}