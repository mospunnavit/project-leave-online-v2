import { NextResponse } from 'next/server';
import { initAdmin } from '@/firebase/firebaseAdmin';
import { firestore } from 'firebase-admin';
export async function GET(req: Request) {
  try {
    const app = await initAdmin();
    const db = app.firestore();
    const { searchParams } = new URL(req.url);
    const selectStatus = searchParams.get('selectStatus');
    
    console.log("selectStatus: " + selectStatus);
    
    // Base query
    let query: firestore.Query = db.collection('FormLeave');
    
    // Apply status filter if provided
    if (selectStatus != null && selectStatus !== "") {
      console.log("Filtering by status: " + selectStatus);
      query = query.where("status", "==", selectStatus);
    }
    
    // Order by createdAt if needed (commented out for now)
    // query = query.orderBy('createdAt', 'desc');
    
    // Execute the query
    const snapshot = await query.get();
    const filteredCount = snapshot.size;
    
    // Get total count (unfiltered)
    const totalSnapshot = await db.collection('FormLeave').get();
    const totalCount = totalSnapshot.size;
    
    return NextResponse.json({
      filteredCount: filteredCount,
      totalCount: totalCount,
    }, { status: 200 });

  } catch (err) {
    console.error('[ADMIN_LEAVEFORM_COUNT_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}