// pages/api/editStatus.ts
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function PUT(req: Request) {
  try {

    // const session = await getServerSession(authOptions);
    // if(!session){
    //     return NextResponse.json({ error: 'login' }, { status: 400 });
    // }
    
    const { id, leave_date, start_time, end_time, reason , leave_type, status } = await req.json();
    
    // ตรวจสอบว่า id และ status ถูกส่งมาหรือไม่
    if (!id || !leave_date || !start_time || !end_time || !reason || !leave_type || !status) {
      return NextResponse.json({ error: 'Missing inputs' }, { status: 400 });
    }

    // อัปเดต status ในฐานข้อมูล
    const [result] = await db.query('UPDATE leaveform SET leave_date = ?, start_time = ?, end_time = ?, reason = ?, leave_type = ?, status = ? WHERE id = ?', [leave_date, start_time, end_time, reason, leave_type, status, id]);

    // ตรวจสอบว่ามีการอัปเดตจริงหรือไม่
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Form not found or not updated' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
