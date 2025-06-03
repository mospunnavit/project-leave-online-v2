// pages/api/editStatus.ts
import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function DELETE(req: Request) {
  try {

    // const session = await getServerSession(authOptions);
    // if(!session){
    //     return NextResponse.json({ error: 'login' }, { status: 400 });
    // }
    
    const { id } = await req.json();
    
    // ตรวจสอบว่า id และ status ถูกส่งมาหรือไม่
    if (!id ) {
      return NextResponse.json({ error: 'Missing inputs' }, { status: 400 });
    }

    // อัปเดต status ในฐานข้อมูล
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

    // ตรวจสอบว่ามีการอัปเดตจริงหรือไม่
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'ไม่พบ user หรือไม่สามารถลบได้' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Delete user successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}