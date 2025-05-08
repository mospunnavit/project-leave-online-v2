import { NextResponse } from 'next/server';
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
  try {
    await initAdmin();
    const db = getFirestore();

    const { username } = await req.json(); // สมมุติ username คือ email

    const snapshot = await db
      .collection("Users")
      .where("username", "==", username)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ user: null, message: "User not found" }, { status: 200 });
    }

    else{
      return NextResponse.json({ user: snapshot.docs[0].data().username, message: "User found" }, { status: 200 });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
