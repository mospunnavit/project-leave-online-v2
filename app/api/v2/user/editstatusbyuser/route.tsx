// pages/api/editStatus.ts

import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id, status } = await req.json();

    // ตรวจสอบว่า id และ status ถูกส่งมาหรือไม่
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // ตรวจสอบว่า status ถูกต้องหรือไม่ (optional: ตรวจสอบ enum)
    const validStatuses = [
      'waiting for head approval',
      'waiting for manager approval',
      'waiting for hr approval',
      'rejected by head',
      'rejected by hr',
      'rejected by manager',
      'approved',
      'waiting',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // อัปเดต status ในฐานข้อมูล
    const [result] = await db.query('UPDATE leaveform SET status = ? WHERE id = ?', [status, id]);

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
