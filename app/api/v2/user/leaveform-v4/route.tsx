import { NextResponse } from 'next/server';
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
        end_leave_date,
        start_time,
        end_time,
        reason,
        leave_type,
        leaveDuration,
        leaveShift,
        useLeaveQuota,
        image_filename 

    }  = await req.json();

    // ตรวจสอบค่าว่าง
    if (!leave_date || !start_time || !end_time || !reason || !leave_type || !leaveDuration || !leaveShift || !useLeaveQuota) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (leave_type === "020004" && (image_filename === '' || image_filename === null || image_filename === undefined)) {
      return NextResponse.json({ error: "Please upload  picture" }, { status: 400 });
    }

    let status = '';
    if (session?.user?.role === "user") {
      status = "waiting for head approval";
    }else if (session?.user?.role === "head") {
      status = "waiting for manager approval";
    }else if (session?.user?.role === "manager") {
      status = "waiting for hr approval";
    }else{
      status = "waiting for head approval";
    }
  

    // หากลาต่อเนื่องคำนวณจำนวนวันใหม่
    if (end_leave_date != null && end_leave_date != undefined) {
        const start_leave_date = new Date(leave_date);
        const end_leave_date2 = new Date(end_leave_date);
        const diffTime = (end_leave_date2.getTime() - start_leave_date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(diffDays);
        if (diffDays < 0){ 
            return NextResponse.json({ error: 'กรุณาเลือกวันสิ้นสุดลาให้มากกว่าวันเริ่มต้น' }, { status: 400 });
        }
        if (diffDays < 1){
            return NextResponse.json({ error: 'หากลาต่อเนื่องกรุณาเลือกวันที่ไม่ใช้วันเดียวกัน' }, { status: 400 });
        }else{
            const totalholiday = await db.query(
                `SELECT COUNT(*) as totalholiday from holiday where date BETWEEN ? AND ?`,
                [leave_date, end_leave_date,]
            )
            const gettotalholiday = totalholiday[0];
            console.log(gettotalholiday);
        }
    }
    await db.query(
      `INSERT INTO leaveform
      (u_id, leave_date, end_leave_date,start_time, end_time, reason,lt_code, lc_code, leaveshift, usequotaleave, status, image_filename) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parseInt(session.user.id as string),
        leave_date,
        end_leave_date || null,
        start_time,
        end_time,
        reason,
        leave_type,
        leaveDuration,
        leaveShift,
        useLeaveQuota,
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