// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RowDataPacket } from 'mysql2';
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const user_id = session?.user?.id;
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    const year = searchParams.get("year" as string) || new Date().getFullYear().toString();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    try {
        const [rows] = await db.query(
            `SELECT * FROM leaveform l 
            LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code WHERE u_id = ? and 
            leave_date BETWEEN ? AND ? 
            ORDER BY submitted_at DESC LIMIT ? OFFSET ?`,
            [user_id, startDate, endDate, pageSize, offset]
          )as RowDataPacket[];;
          console.log(rows);
      if (rows.length  === 0) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
      }
      return NextResponse.json(rows);
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  






