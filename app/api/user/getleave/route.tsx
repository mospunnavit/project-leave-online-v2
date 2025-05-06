import { NextResponse } from 'next/server';
import { db } from '@/firebase/clientApp';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const limitParam = Number(searchParams.get("limit")) || 5;
    const cursor = searchParams.get("cursor"); // cursor = ISO string of date

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const formLeaveRef = collection(db, "FormLeave");

    let q = query(
      formLeaveRef,
      where("email", "==", email),
      orderBy("createdAt", "desc"),
      limit(limitParam)
    );
    console.log(q);
    // ถ้ามี cursor (pagination)
    if (cursor) {
      const cursorTimestamp = Timestamp.fromDate(new Date(cursor));
      q = query(
        formLeaveRef,
        where("email", "==", email),
        orderBy("createdAt", "desc"),
        limit(limitParam)
      );
    }
 
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.empty);
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        leaveFields: docData.email,
        reason: docData.reason,
        createdAt: docData.createdAt?.toDate?.() ?? null,
      };
    });
    console.log(data);
    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}