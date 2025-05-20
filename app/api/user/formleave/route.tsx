import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
export const config = {
  api: {
    bodyParser: false, // ❌ ถ้าปิดแล้วไม่ได้จัดการ stream เอง → จะได้ ReadableStream
  },
};
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if(session?.user?.role == null){
      return NextResponse.json({ error: "login" }, { status: 400 });
    }

  try {
    await initAdmin();
    const db = getFirestore();
    const body = req.body;
    console.log("Body ที่รับจาก client:", body);
    const { selectedLeavetype, leaveTime, reason, leaveDays, periodTime, uploadedPath } = await req.json();
    
    if (!selectedLeavetype || !leaveTime || !leaveDays || !reason || !periodTime) {
      return NextResponse.json({ error: "Please complete all inputs" }, { status: 400 });
    }
    
    if (selectedLeavetype === "มีใบรับรองแพทย์" && uploadedPath === '') {
      console.log("selectedLeavetype, uploadedPath", selectedLeavetype, uploadedPath);
      return NextResponse.json({ error: "Please upload  picture" }, { status: 400 });
    }

    let status = '';
    if (session?.user?.role === "user") {
      status = "waiting for head approval";
    }else if (session?.user?.role === "head") {
      status = "waiting for manager approval";
    }else if (session?.user?.role === "manager") {
      status = "waiting for hr approval";
    }else if (session?.user?.role === "hr") {
      status = "approved";
    }
   
    
    await db.collection("FormLeave").add({
      selectedLeavetype,
      uploadedPath,
      leaveTime,
      reason,
      leaveDays,
      fullname: session?.user?.firstname + " " + session?.user?.lastname,
      username: session?.user?.username,
      department: session?.user?.department,
      role: session?.user?.role,
      status: status,
      periodTime,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
