import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/firebase/clientApp';
import { addDoc, collection } from 'firebase/firestore';
import { Users } from '@/app/types/users';
export async function POST(req:Request) {
    try{
        const{
            email,
            firstname,
            lastname,
            Department,
            password,
            cpassword
        } = await req.json();   
         


        if(password != cpassword){
            return NextResponse.json({error: "Password do not match!"}, {status: 400});
        }

        if(!email || !password || !cpassword){
            return NextResponse.json({error: "Please complete all inputs."}, {status: 400});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ ใช้ interface User
        const userData: Users = {
          email,
          role: 'user',
          password: hashedPassword,
          createdAt: new Date()
        };
    
        const docRef = await addDoc(collection(db, 'Users'), userData);
        return NextResponse.json({message: "Success!"}, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({error: err}, {status: 500});
    }
}