import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
    
  try {
    await initAdmin();
    const db = getFirestore();
    const { docId, status } = await req.json();
    console.log(docId, status);
    if (!docId || !status) {
      return NextResponse.json({ error: "Please complete all inputs" }, { status: 400 });
    }

    if(session?.user?.role == null){
      return NextResponse.json({ error: "login" }, { status: 400 });
    }
    
     if (!(session?.user?.role === "head" || session?.user?.role === "manager" || session?.user?.role === "hr")) {
      return NextResponse.json({ error: "You are not authorized" }, { status: 403 });
    }
    
    await db.collection("FormLeave").doc(docId).update({
      status
    });
    
    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}