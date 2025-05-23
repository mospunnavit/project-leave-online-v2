import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'login' }, { status: 400 });
  }
  try {
    const {
      leave_date,
      start_time,
      end_time,
      reason,
      leave_type,
      image_filename,
    } = await req.json();
    console.log(leave_date, start_time, end_time, reason, leave_type, image_filename);
    // ตรวจสอบค่าว่าง
    if (!leave_date || !start_time || !end_time || !reason || !leave_type) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
     if (leave_type === "มีใบรับรองแพทย์" && image_filename === '') {
      return NextResponse.json({ error: "Please upload  picture" }, { status: 400 });
    }

    let status = '';
    if (session?.user?.role === "user") {
      status = "waiting for head approval";
    }else if (session?.user?.role === "head") {
      status = "waiting for manager approval";
    }else if (session?.user?.role === "manager") {
      status = "waiting for hr approval";
    }else if (session?.user?.role === "hr") {
      status = "approved";
    }
  

    // บันทึกข้อมูลลง MySQL
    await db.query(
      `INSERT INTO leaveform
      (u_id, leave_date, start_time, end_time, reason, leave_type, status, image_filename) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(session.user.id as string),
        leave_date,
        start_time,
        end_time,
        reason,
        leave_type,
        status,
        image_filename || null,
      ]
    );

    return NextResponse.json({ message: 'Leave request submitted successfully!' }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}