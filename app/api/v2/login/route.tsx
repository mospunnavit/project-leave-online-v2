import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { Users } from '@/app/types/users';
export async function POST(req: Request) {
  try {
    const {
      username,
      firstname,
      lastname,
      department,
      password,
      cpassword,
    } = await req.json();

    // ตรวจสอบค่าว่าง
    if (!username || !password || !cpassword || !firstname || !lastname || !department) {
      return NextResponse.json({ error: 'Please complete all inputs.' }, { status: 400 });
    }

    // ตรวจสอบ password ตรงกันไหม
    if (password !== cpassword) {
      return NextResponse.json({ error: 'Password do not match!' }, { status: 400 });
    }

    // ตรวจสอบ username ซ้ำ
    const [rows] = await db.query<Users[]>(
    'SELECT * FROM users WHERE username = ?',
    [username]
    );
    if (rows.length > 0) {
      return NextResponse.json({ error: 'Username already exists!' }, { status: 400 });
    }

    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      `INSERT INTO users (username, firstname, lastname, department, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, firstname, lastname, department, hashedPassword, 'user']
    );

    return NextResponse.json({ message: 'Success!' }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
