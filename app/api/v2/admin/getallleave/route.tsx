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
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    
    try {
        const [dataleave] = await db.query(
            `SELECT l.id ,u.username, u.firstname, u.lastname, u.department, 
            l.leave_date, l.start_time, l.end_time,l.reason, l.leave_type, l.status, l.submitted_at, l.image_filename
            FROM leaveform l LEFT JOIN users u ON l.u_id = u.id LIMIT ? OFFSET ?`,
            [pageSize, offset]
          );
          
        console.log(dataleave);
      return NextResponse.json({dataleave}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 


