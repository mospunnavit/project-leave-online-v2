// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RawUserWithDepartments } from '@/app/types/users';
import transformUser from '@/lib/transformUser';

export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
    const page = parseInt((getPage as string) || '1');
    const pageSize = 5;
    const offset = (page - 1) * pageSize;
    try {
        const [datauser] = await db.query<RawUserWithDepartments[]>(`
   SELECT 
  u.id, 
  u.username, 
  u.firstname, 
  u.lastname, 
  u.role,
  u.department AS main_department_id,                         
  main_d.department_name AS main_department_name,             
  GROUP_CONCAT(d.id SEPARATOR ',') AS departments_id,         
  GROUP_CONCAT(d.department_name SEPARATOR ',') AS departments_name
FROM users u
LEFT JOIN departments main_d ON u.department = main_d.id     
LEFT JOIN user_departments ud ON u.id = ud.user_id
LEFT JOIN departments d ON ud.department_id = d.id
GROUP BY u.id, main_d.department_name, u.department, u.username, u.firstname, u.lastname, u.role LIMIT ? OFFSET ?`,
            [pageSize, offset]
          );
          
        const users = datauser.map(transformUser);
    return NextResponse.json({users} , { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  




