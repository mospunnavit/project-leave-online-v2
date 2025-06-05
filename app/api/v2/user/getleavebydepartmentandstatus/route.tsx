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
    if(session?.user?.role == "user"){
        return NextResponse.json({ error: "You are not authorized" }, { status: 403 });
    }
    const user_id = session?.user?.id;
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const getStatus = searchParams.get("status" as string) || '';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    try {
        //แยกเป็น hr จะดูได้หลาย แผนก
    if (session?.user?.role == "hr"){
         if (getStatus == '') {
    const [data] = await db.query(
                        `SELECT 
                            l.id,u.username, u.firstname, u.lastname, u.department, 
                            l.leave_date, l.start_time, l.end_time, 
                            l.reason, l.lt_code, lt_name, l.status, l.submitted_at, 
                            l.image_filename FROM leaveform l 
                        LEFT JOIN users u ON l.u_id = u.id
                        LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
                        ORDER BY l.id 
                        LIMIT ? OFFSET ?`,
                        [ pageSize, offset]
);            return NextResponse.json({data}, { status: 200 });
        }else{
            const [data] = await db.query( `SELECT 
                            l.id, u.username, u.firstname, u.lastname, u.department, 
                            l.leave_date, l.start_time, l.end_time, 
                            l.reason, l.lt_code, lt_name, l.status, l.submitted_at, 
                            l.image_filename FROM leaveform l 
                        LEFT JOIN users u ON l.u_id = u.id
                        LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
                        WHERE l.status = ?
                        ORDER BY l.id 
                        LIMIT ? OFFSET ?`,
                        [getStatus, pageSize, offset]);
            return NextResponse.json({data}, { status: 200 });
        }

    }else{
        if (getStatus == '') {
    const [data] = await db.query(
                        `SELECT 
                            l.id,u.username, u.firstname, u.lastname, u.department, 
                            l.leave_date, l.start_time, l.end_time, 
                            l.reason, l.lt_code, lt_name, l.status, l.submitted_at, 
                            l.image_filename FROM leaveform l 
                        LEFT JOIN users u ON l.u_id = u.id
                        LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
                        WHERE u.department = ? 
                        ORDER BY l.id 
                        LIMIT ? OFFSET ?`,
                        [session?.user?.department, pageSize, offset]
);            return NextResponse.json({data}, { status: 200 });
        }else{
            const [data] = await db.query( `SELECT 
                            l.id, u.username, u.firstname, u.lastname, u.department, 
                            l.leave_date, l.start_time, l.end_time, 
                            l.reason, l.lt_code, lt_name, l.status, l.submitted_at, 
                            l.image_filename FROM leaveform l 
                        LEFT JOIN users u ON l.u_id = u.id
                        LEFT JOIN leave_types lt ON l.lt_code = lt.lt_code
                        WHERE u.department = ? and l.status = ?
                        ORDER BY l.id 
                        LIMIT ? OFFSET ?`,
                        [session?.user?.department, getStatus, pageSize, offset]);
            return NextResponse.json({data}, { status: 200 });
        }

    }
        
    
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 