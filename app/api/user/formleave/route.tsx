import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log(session);

  try {
    await initAdmin();
    const db = getFirestore();

    const { selectedLeavetype, leaveTime, reason, leaveDays } = await req.json();

    if (!selectedLeavetype || !leaveTime || !leaveDays || !reason) {
      return NextResponse.json({ error: "Please complete all inputs" }, { status: 400 });
    }
    if(session?.user?.role == null){
      return NextResponse.json({ error: "login" }, { status: 400 });
    }

    await db.collection("FormLeave").add({
      selectedLeavetype,
      leaveTime,
      reason,
      leaveDays,
      fullname: session?.user?.firstname + " " + session?.user?.lastname,
      username: session?.user?.username,
      department: session?.user?.department,
      role: session?.user?.role,
      status: "waiting head approval",
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
