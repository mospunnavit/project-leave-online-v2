import { NextResponse } from 'next/server';
import { initAdmin } from '@/firebase/firebaseAdmin';
export async function GET(req: Request) {
  try {
    
    const app = await initAdmin();
    const db = app.firestore();
    
    const snapshot = await db.collection('Users').get();

    const totalCount = snapshot.size; // Total number of documents

    return NextResponse.json({
      count: totalCount,
    }, { status: 200 });

  } catch (err) {
    console.error('[ADMIN_LEAVEFORM_COUNT_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

