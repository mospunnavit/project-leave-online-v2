// app/api/test/route.ts
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
  try {
    await initAdmin(); // สำคัญ! ต้อง initialize ก่อนเรียก getFirestore

    const db = getFirestore();
    const snapshot = await db.collection("Users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users);
  } catch (err) {
    console.error("Firestore error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
