// app/api/test/route.ts
import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
  try {
    await initAdmin();
    const db = getFirestore();

    const url = new URL(req.url);
    const searchField = url.searchParams.get("field") || "name";
    const searchValue = url.searchParams.get("value") || "";
    const limit = parseInt(url.searchParams.get("limit") || "10");
    console.log(searchField, searchValue)
    let snapshot;

    if (searchValue) {
      snapshot = await db.collection("Users")
        .where(searchField, ">=", searchValue)
        .where(searchField, "<", searchValue + "\uf8ff")
        .limit(limit)
        .get();
    } else {
      snapshot = await db.collection("Users")
        .limit(limit)
        .get();
    }

    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ results });

  } catch (err) {
    console.error("Firestore error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
