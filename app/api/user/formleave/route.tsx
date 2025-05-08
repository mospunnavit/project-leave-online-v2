import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
  const mockupusersession = {
    eamil: "test",
    department: "IT",
    role: "user",
  };

  try {
    await initAdmin();
    const db = getFirestore();

    const { selectedLeavetype, leaveTime, reason, leaveDays } = await req.json();

    if (!selectedLeavetype || !leaveTime || !leaveDays || !reason) {
      return NextResponse.json({ error: "Please complete all inputs" }, { status: 400 });
    }

    if (mockupusersession.role == null) {
      return NextResponse.json({ error: "login" }, { status: 400 });
    }

    await db.collection("FormLeave").add({
      selectedLeavetype,
      leaveTime,
      reason,
      leaveDays,
      email: mockupusersession.eamil,
      department: mockupusersession.department,
      role: mockupusersession.role,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
