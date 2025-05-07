import { NextResponse } from 'next/server';
import { initAdmin } from '@/firebase/firebaseAdmin'; // ฟังก์ชันที่คุณเขียนไว้

export async function GET(req: Request) {
  try {
    const app = await initAdmin();
    const db = app.firestore(); // ได้ Firestore จาก Admin SDK

    const snapshot = await db.collection('Users').get();

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
      };
    });

    return NextResponse.json({ users }, { status: 200 });

  } catch (err) {
    console.error('[ADMIN_FIRESTORE_GET_ERROR]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
