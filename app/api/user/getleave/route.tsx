import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    const { searchParams } = new URL(req.url);
    const lastDoc = searchParams.get("lastDoc");
    const direction = searchParams.get("direction") || "next"; // "next" or "prev"
    const limitParam = Number(searchParams.get("limit")) || 5;
   

    if (!session?.user?.username)  {
      return NextResponse.json({ error: "You are not authorized" }, { status: 403 });
    }
    await initAdmin();
    const db = getFirestore();
    const formLeaveRef = db.collection("FormLeave");
    let q;

    // If we have a lastDoc reference, we need to get the actual document first
    let lastDocRef = null;
    if (lastDoc) {
      const docRef = db.collection("FormLeave").doc(lastDoc);
      const docSnap = await docRef.get();
      if (docSnap.exists) {
        lastDocRef = docSnap;
      } else {
        console.error("Last document reference not found");
        return NextResponse.json({ error: "Last document reference not found" }, { status: 404 });
      }
    }

    let querySnapshot;

    // Build query based on direction and lastDoc
    if (direction === "prev" && lastDocRef) {
      // Previous page - use endBefore and limitToLast
      querySnapshot = await formLeaveRef
        .where("username", "==", session?.user?.username)
        .orderBy("createdAt", "desc")
        .endBefore(lastDocRef)
        .limitToLast(limitParam)
        .get();
    } else if (lastDocRef) {
      // Next page - use startAfter
      querySnapshot = await formLeaveRef
        .where("username", "==", session?.user?.username)
        .orderBy("createdAt", "desc")
        .startAfter(lastDocRef)
        .limit(limitParam)
        .get();
    } else {
      // First page
      querySnapshot = await formLeaveRef
        .where("username", "==", session?.user?.username)
        .orderBy("createdAt", "desc")
        .limit(limitParam)
        .get();
    }

    if (querySnapshot.empty) {
      return NextResponse.json({
        data: [],
        hasMore: false,
        lastVisible: lastDoc
      }, { status: 200 });
    }

    // Get the last visible document for next page cursor
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Check if there are more documents after this batch
    const nextBatchSnapshot = await formLeaveRef
      .where("username", "==", session?.user?.username)
      .orderBy("createdAt", "desc")
      .startAfter(lastVisible)
      .limit(1)
      .get();
    
    const hasMore = !nextBatchSnapshot.empty;

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      console.log(doc.id)
      return {
        username: docData.username,
        leaveTime: docData.leaveTime,
        fullname: docData.fullname,
        leaveDays: docData.leaveDays,
        selectedLeavetype: docData.selectedLeavetype,
        reason: docData.reason,
        status: docData.status,
        periodTime: docData.periodTime,
        createdAt: docData.createdAt?.toDate(),
      };
    });

    return NextResponse.json({
      data,
      hasMore,
      lastVisible: lastVisible.id,
    }, { status: 200 });
  } catch (err) {
    console.error("Error in API:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}