import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { ResultSetHeader } from 'mysql2';


export async function POST(req: Request) {
  const body = await req.json();

  const { department_code, department_name } = body;
  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO departments (department_code, department_name) VALUES (?, ?)',
      [department_code, department_name]
    );
    return NextResponse.json(result);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}