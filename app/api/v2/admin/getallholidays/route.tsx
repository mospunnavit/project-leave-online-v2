// pages/api/users.js
import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request)  {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const getPage = searchParams.get("page" as string) || '1';
  
 
    try {
        const [holidays] = await db.query(
            'SELECT * FROM holiday order by date desc',
           
          );
          
      return NextResponse.json({holidays}, { status: 200 });
    } catch (err : Error | any) {
       
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  


