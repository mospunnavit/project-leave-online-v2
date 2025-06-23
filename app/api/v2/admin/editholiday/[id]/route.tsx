import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ไข 1: เพิ่ม Promise
) {
  const { id } = await params; // ✅ แก้ไข 2: await params แล้ว destructure
  const body = await req.json();
  const { holiday_date, holiday_remark, is_sunday } = body;
  const HolidayId = parseInt(id); // ✅ แก้ไข 3: ไม่ต้อง await parseInt

  try {
        await db.query(
    `UPDATE holiday SET date = ?, remark = ?, sunday = ? WHERE id = ?`,
    [holiday_date, holiday_remark, is_sunday, HolidayId]
  );
    return NextResponse.json({ success: true });
  }catch (err : Error | any) {
       console.log(err)
        if(err.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'Holiday already exists' }, { status: 400 });
        }
  }
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   
}