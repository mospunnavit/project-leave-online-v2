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
    const from_date = searchParams.get("from_date" as string) || '';
    const to_date = searchParams.get("to_date" as string) || '';
    const status = searchParams.get("status" as string) || 'approved';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
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
        if(from_date.trim() && to_date.trim()) {
            conditions.push('(l.leave_date BETWEEN ? AND ? OR l.end_leave_date BETWEEN ? AND ?)');
            params.push(from_date.trim(), to_date.trim(), from_date.trim(), to_date.trim());
            
        }
        
        if(status.trim()) {
            conditions.push('l.status = ?');
            params.push(status.trim());
        }
        console.log(params);
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const [data] = await db.query(
            `SELECT l.id ,u.username, u.firstname, u.lastname, u.department, 
            l.leave_date, l.end_leave_date, l.start_time, l.end_time, l.reason, l.lt_code , lt.lt_name, l.lc_code, l.usequotaleave,
            l.status, l.submitted_at, l.image_filename, l.exported, d.department_name
            FROM leaveform l 
            LEFT JOIN users u ON l.u_id = u.id
            LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
            LEFT JOIN departments d ON u.department = d.id
            ${whereClause} order by l.leave_date LIMIT ? OFFSET ? `,
            [...params, pageSize, offset]
          );
        
          console.log(data);
    return NextResponse.json({data}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  

