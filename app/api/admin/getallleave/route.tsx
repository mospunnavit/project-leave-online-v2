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
    const selectStatus = searchParams.get("selectStatus");
    const direction = searchParams.get("direction") || "next"; // "next" or "prev"
    const limitParam = Number(searchParams.get("limit")) || 10;
    
    await initAdmin();
    const db = getFirestore();
    const formLeaveRef = db.collection("FormLeave");

    // Build base query
    let baseQuery;
 
   baseQuery = formLeaveRef
  .orderBy("createdAt", "desc");
    if (selectStatus != null && selectStatus !== "") {
        console.log("selectStatus IN: " + selectStatus);
        baseQuery = baseQuery.where("status", "==", selectStatus);
    }

    // Get lastDoc reference if needed
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

    // Paginate based on direction and cursor
    let querySnapshot;
    if (direction === "prev" && lastDocRef) {
      querySnapshot = await baseQuery
        .endBefore(lastDocRef)
        .limitToLast(limitParam)
        .get();
    } else if (lastDocRef) {
      querySnapshot = await baseQuery
        .startAfter(lastDocRef)
        .limit(limitParam)
        .get();
    } else {
      querySnapshot = await baseQuery
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

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Check if there's more data
    const nextBatchSnapshot = await baseQuery
      .startAfter(lastVisible)
      .limit(1)
      .get();

    const hasMore = !nextBatchSnapshot.empty;
    
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        username: docData.username,
        department: docData.department,
        leaveTime: docData.leaveTime,
        fullname: docData.fullname,
        leaveDays: docData.leaveDays,
        selectedLeavetype: docData.selectedLeavetype,
        reason: docData.reason,
        status: docData.status,
        periodTime: docData.periodTime,
        createdAt: docData.createdAt?.toDate(),
        uploadedPath: docData.uploadedPath
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
