import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function POST(req:Request) {
    try{
        const { email } = await req.json();
        const user = collection(db, 'Users');
        const q = query(user, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        return NextResponse.json({ user : !querySnapshot.empty }, {status: 200});
        

    }catch(err){
        console.log(err);
    }
}