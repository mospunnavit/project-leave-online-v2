// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const username = searchParams.get("username" as string) || '';
    const name = searchParams.get("name" as string) || '';
    const leave_date = searchParams.get("leave_date" as string) || '';
    const status = searchParams.get("status" as string) || '';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    try {
        const conditions = [];
        const params = [];


         if (username.trim()) {
            conditions.push('u.username LIKE ?');
            params.push(`%${username.trim()}%`);
        }
        if(name.trim()) {
            conditions.push('u.firstname LIKE ? OR u.lastname LIKE ?');
            params.push(`%${name.trim()}%`);
        }
        if(leave_date.trim()) {
            conditions.push('l.leave_date = ?');
            params.push(leave_date.trim());
        }
        if(status.trim()) {
            conditions.push('l.status = ?');
            params.push(status.trim());
        }
        
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        console.log("condition"+whereClause)
        const [dataleave] = await db.query(
            `SELECT l.id ,u.username, u.firstname, u.lastname, u.department, 
            l.leave_date, l.start_time, l.end_time,l.reason, l.leave_type, l.status, l.submitted_at, l.image_filename
            FROM leaveform l LEFT JOIN users u ON l.u_id = u.id ${whereClause} LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
          );
  
        console.log(dataleave[0].leave_date.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }));
      return NextResponse.json({dataleave}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  

