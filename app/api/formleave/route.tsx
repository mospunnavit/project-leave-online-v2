import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {
        const{
            email,
            leaveFields,
            reason
        } = await req.json();
        console.log("mos"+ email, leaveFields, reason);
        return NextResponse.json({message: "Success!"}, {status: 200});
    } catch (err) {
        return NextResponse.json({error: err}, {status: 500});
    }
}