import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
export async function POST(req:Request) {
    try{
        const{
            username,
            firstname,
            lastname,
            department,
            password,
            cpassword
        } = await req.json();   
        await initAdmin();
        const db = getFirestore();
        const userData = {
            username,
            firstname,
            lastname,
            department,
            password: await bcrypt.hash(password, 10),
            role: "user"
        }


        if(password != cpassword){
            return NextResponse.json({error: "Password do not match!"}, {status: 400});
        }

        if(!username || !password || !cpassword || !firstname || !lastname || !department){
            return NextResponse.json({error: "Please complete all inputs."}, {status: 400});
        }
      
    
        await db.collection("Users").add(userData);
        return NextResponse.json({message: "Success!"}, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({error: err}, {status: 500});
    }
}