// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({ error: 'login' }, { status: 400 });
    }
    if(session?.user?.role == "user" && session?.user?.department_name != "HR"){
        return NextResponse.json({ error: 'You are not authorized' }, { status: 403 });
    }

    const user_id = session?.user?.id 
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const getStatus = searchParams.get("status" as string) || '';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    try {

        const conditions = [];
        const params = [];

        if (getStatus.trim() != '') {
            conditions.push('lf.status = ?');
            params.push(getStatus.trim());
        }
        
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        if(session?.user?.department_name == "HR"){
            console.log("user department name in hr",session?.user?.department_name);
            const [data] = await db.query(
                ` 
                SELECT lf.id ,lf.u_id, lf.leave_date, lf.start_time, lf.end_time, lf.reason, lf.status, lf.image_filename, 
                lf.submitted_at , u.username ,u.firstname, u.lastname, u.department, d.department_name, lf.lt_code, lt_name
                FROM leaveform lf 
                LEFT JOIN users u ON lf.u_id = u.id
                LEFT JOIN leave_types lt ON lf.lt_code = lt.lt_code
                LEFT JOIN departments d ON u.department = d.id
                ${whereClause}
                LIMIT ? OFFSET ?`,
                [...params,pageSize, offset]
            );          
            return NextResponse.json({data}, { status: 200 });
        }else{
            console.log("user department name in 2",session?.user?.department_name);
            console.log("user department name in 2",session?.user?.department, user_id);
             const [data] = await db.query(
                        ` 
                        SELECT lf.u_id, lf.leave_date, lf.start_time, lf.end_time, lf.reason, lf.status, lf.image_filename, 
                        lf.submitted_at , u.username ,u.firstname, u.lastname, u.department, d.department_name, lf.lt_code, lt_name
                        FROM leaveform lf 
                        LEFT JOIN users u ON lf.u_id = u.id
                        LEFT JOIN leave_types lt ON lf.lt_code = lt.lt_code
                        LEFT JOIN departments d ON u.department = d.id
                        INNER JOIN (SELECT  ud.user_id, ud.department_id  FROM users u
                        LEFT join user_departments ud on u.id = ud.user_id where ud.user_id = ?
                        ) td on td.department_id = u.department ${whereClause}
                        LIMIT ? OFFSET ?`,
                        [ user_id, ...params, pageSize, offset]
);            return NextResponse.json({data}, { status: 200 });
        }
        
    
        
    
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 