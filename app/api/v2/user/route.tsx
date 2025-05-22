// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
  
    try {
      const [rows] = await db.query('SELECT * FROM users');
      return NextResponse.json(rows);
    } catch (err) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  






