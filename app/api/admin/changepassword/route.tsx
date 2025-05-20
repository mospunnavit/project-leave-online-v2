import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export async function POST(req:Request) {
      const session = await getServerSession(authOptions);
        if (!session) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    
    if (session.user?.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Forbidden: Insufficient permissions' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    try{
        const{
            id,
            password,
            cpassword,
        } = await req.json();   
        await initAdmin();
        const db = getFirestore();
       


        if(password != cpassword){
            return NextResponse.json({error: "Password do not match!"}, {status: 400});
        }
        const newpassword = await bcrypt.hash(password, 10);
        const userData = {
            password: newpassword,
        }
        await db.collection("Users").doc(id).update(userData);

        return NextResponse.json({message: "Success!"}, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({error: err}, {status: 500});
    }
}