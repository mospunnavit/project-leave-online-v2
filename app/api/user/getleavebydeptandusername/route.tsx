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
    const getFiledSearch = searchParams.get("filed") || "";
    const getValueSearch = searchParams.get("value") || "";
    const limitParam = Number(searchParams.get("limit")) || 5;

    if (!session?.user?.username || !(session?.user?.role === "head" || session?.user?.role === "manager" || session?.user?.role === "hr")) {
      return NextResponse.json({ error: "You are not authorized" }, { status: 403 });
    }
    
    await initAdmin();
    const db = getFirestore();
    const formLeaveRef = db.collection("FormLeave");

    // Build base query ดูได้เฉพราะ แผนก ยกเว้นคนที่มี สิทธ์ HR
    let baseQuery;
    
    if(session?.user?.role === "hr"){
      baseQuery = formLeaveRef
      .orderBy("createdAt", "desc");
    }else{
      baseQuery = formLeaveRef
      .where("department", "==", session?.user?.department)
      .orderBy("createdAt", "desc");
    }
    
    console.log("selectStatus: " + selectStatus);

    if (selectStatus != null && selectStatus !== "") {
        baseQuery = baseQuery.where("status", "==", selectStatus);
    }

    if(getFiledSearch != null && getFiledSearch !== "" && getValueSearch != null && getValueSearch !== "") {
         baseQuery = baseQuery.where(getFiledSearch, ">=", getValueSearch).where(getFiledSearch, "<", getValueSearch + "\uf8ff")
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
        uploadedPath: docData.uploadedPath,
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
