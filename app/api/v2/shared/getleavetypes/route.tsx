import db from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function GET(req: Request){
    const session = await getServerSession(authOptions);
    try {
        const [dataleavetypes] = await db.query(
            `select * from leave_types`,
            
          );
          
    
      return NextResponse.json({dataleavetypes}, { status: 200 });
    } catch (err) {
        console.log(err)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 


