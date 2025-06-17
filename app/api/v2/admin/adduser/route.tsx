import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';
import { Users } from '@/app/types/users';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const body = await req.json();

  const {
    username,
    firstname,
    lastname,
    password,
    cpassword,
    role,
    department,
    departments, // array เช่น [1, 2]
  } = body;
  if (password !== cpassword) {
    return NextResponse.json(
      { error: 'Password do not match!' },
      { status: 400 }
    );
  }
   const [rows] = await db.query<Users[]>(
    'SELECT * FROM users WHERE username = ?',
    [username]
    );
    if (rows.length > 0) {
      return NextResponse.json({ error: 'Username already exists!' }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  try {
    // 1. สร้าง user ใหม่ใน table `users`
    const [result] = await db.query(
      `INSERT INTO users (username, firstname, lastname, password, role, department)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, firstname, lastname, hashedPassword, role, department]
    ) as [ResultSetHeader, any];

      const userId = result.insertId;
        console.log('New user ID:', userId);
    // 2. เพิ่มแผนกหลายแผนกในตารางกลาง
    if (departments.length !== 0) {
      const values = departments.map((deptId: number) => [userId, deptId]);
    await db.query(
      `INSERT INTO user_departments (user_id, department_id) VALUES ?`,
      [values]);
    }
    
    

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
