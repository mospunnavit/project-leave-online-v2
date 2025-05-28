// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    try {
        const [rows] = await db.query(
            'SELECT * FROM leaveform ORDER BY submitted_at DESC LIMIT ? OFFSET ?',
            [pageSize, offset]
          );
          
        console.log(rows);
      return NextResponse.json(rows);
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  


function convertToThaiTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
}



