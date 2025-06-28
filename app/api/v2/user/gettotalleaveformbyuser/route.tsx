// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const user_id = session?.user?.id;
    const { searchParams } = new URL(req.url);
  
    if (!session) {
        return NextResponse.json({ error: 'login' }, { status: 400 });
    }

    try {
        const [leave_types_total] = await db.query(
            `SELECT lt.lt_code, lt.lt_name, lt.quotaperyear, 
            SUM(CASE WHEN lt.lt_code = l.lt_code AND l.status = 'approved' THEN l.usequotaleave ELSE 0 END) AS used_quota, 
            lt.quotaperyear - SUM(CASE WHEN lt.lt_code = l.lt_code THEN l.usequotaleave ELSE 0 END) 
            AS left_quota FROM leave_types lt CROSS JOIN (SELECT DISTINCT u.id FROM users u WHERE u.id = ?) 
            u LEFT JOIN leaveform l ON l.lt_code = lt.lt_code AND l.u_id = u.id GROUP BY lt.lt_code, lt.lt_name, lt.quotaperyear ORDER BY lt.lt_code;`,
            [user_id]
          );
          
      return NextResponse.json({leave_types_total}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  






