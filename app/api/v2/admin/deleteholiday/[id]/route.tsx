import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ไข 1: เพิ่ม Promise
) {
  const { id } = await params; // ✅ แก้ไข 2: await params แล้ว destructure
  const HolidayId = parseInt(id); // ✅ แก้ไข 3: ไม่ต้อง await parseInt

  try {
        await db.query(
    `DELETE FROM holiday WHERE id = ?`,
    [HolidayId]
  );
    return NextResponse.json({ success: true });
  }catch (err) {
      console.log(err);
  }
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   
}