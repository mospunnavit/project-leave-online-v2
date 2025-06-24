import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
     try {
        const [departmentsManagement] = await db.query(`SELECT 
                ud.user_id, 
                GROUP_CONCAT(d.department_name SEPARATOR ', ') AS departments
                FROM users u
                LEFT JOIN user_departments ud ON u.id = ud.user_id
                LEFT JOIN departments d ON ud.department_id = d.id
                where u.id = ?
                GROUP BY ud.user_id;`, 
            [userId]);
      return NextResponse.json({departmentsManagement}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 