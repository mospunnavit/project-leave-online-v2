// pages/api/editStatus.ts

import db from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {

    // const session = await getServerSession(authOptions);
    // if(!session){
    //     return NextResponse.json({ error: 'login' }, { status: 400 });
    // }
    
    const { id, password, cpassword } = await req.json();
    
    // ตรวจสอบว่า id และ status ถูกส่งมาหรือไม่
    if (!id || !password || !cpassword ) {
      return NextResponse.json({ error: 'Missing inputs' }, { status: 400 });
    }

    if (password !== cpassword) {
      return NextResponse.json({ error: 'Password do not match!' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // อัปเดต status ในฐานข้อมูล
    const [result] = await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
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
