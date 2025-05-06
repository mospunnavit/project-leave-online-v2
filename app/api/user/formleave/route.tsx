import { NextResponse } from "next/server";
import { addDoc, collection } from 'firebase/firestore';
import { db } from "@/firebase/clientApp";
export async function POST(req:Request) {
    try {
        const{
            email,
            leaveFields,
            reason
        } = await req.json();
        if(!email || !leaveFields || !reason){
            return NextResponse.json({error: "Please complete all inputs or login."}, {status: 400});
        }
        console.log("mos"+ email, leaveFields, reason);
        const docRef = await addDoc(collection(db, 'FormLeave'), {email, leaveFields, reason, createdAt: new Date()});
        return NextResponse.json({message: "Success!"}, {status: 200});
    } catch (err) {
        return NextResponse.json({error: err}, {status: 500});
    }
}