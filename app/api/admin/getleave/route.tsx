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
  endBefore,
  limitToLast,
  doc,
  getDoc
} from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const lastDoc = searchParams.get("lastDoc");
    const direction = searchParams.get("direction") || "next"; // "next" or "prev"
    const limitParam = Number(searchParams.get("limit")) || 5;
    
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    const userRef = collection(db, 'Users');
    const check = query(userRef, where('email', '==', email));
    const checkSnapshot = await getDocs(check);

    if (checkSnapshot.empty) {
      throw new Error('No user found with this email');
    }

    const userDoc = checkSnapshot.docs[0];
    const userData = userDoc.data();
    if(userData.role !== 'admin') {
      return NextResponse.json({ error: "You are not admin" }, { status: 403 });
    }

    const formLeaveRef = collection(db, "FormLeave");
    let q;
    
    // If we have a lastDoc reference, we need to get the actual document first
    let lastDocRef = null;
    if (lastDoc) {
      const docRef = doc(db, "FormLeave", lastDoc);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        lastDocRef = docSnap;
      } else {
        return NextResponse.json({ error: "Last document reference not found" }, { status: 404 });
      }
    }
    
    // Build query based on direction and lastDoc
    if (direction === "prev" && lastDocRef) {
      // Previous page - use endBefore and limitToLast
      q = query(
        formLeaveRef,
        orderBy("createdAt", "desc"),
        endBefore(lastDocRef),
        limitToLast(limitParam)
      );
    } else if (lastDocRef) {
      // Next page - use startAfter
      q = query(
        formLeaveRef,
        orderBy("createdAt", "desc"),
        startAfter(lastDocRef),
        limit(limitParam)
      );
    } else {
      // First page
      q = query(
        formLeaveRef,
        orderBy("createdAt", "desc"),
        limit(limitParam)
      );
    }
    
    const querySnapshot = await getDocs(q);
    
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
    const nextBatchQuery = query(
      formLeaveRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(1)
    );
    const nextBatchSnapshot = await getDocs(nextBatchQuery);
    const hasMore = !nextBatchSnapshot.empty;
    
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        email: docData.email,
        leaveFields: docData.leaveFields,
        reason: docData.reason,
        createdAt: docData.createdAt?.toDate?.() ?? null,
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