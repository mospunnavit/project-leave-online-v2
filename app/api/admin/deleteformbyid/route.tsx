import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { initAdmin } from "@/firebase/firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    const session = await getServerSession(authOptions);
    await initAdmin();
    const db = getFirestore();
    // if (!session) {
    //   return new Response(JSON.stringify({ message: 'Unauthorized' }), {
    //     status: 401,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    // ตรวจสอบสิทธิ์
    // if (session.user?.role !== 'admin' && session.user?.role !== 'hr') {
    //   return new Response(JSON.stringify({ message: 'Forbidden: Insufficient permissions' }), {
    //     status: 403,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    // รับข้อมูลจาก request body
    const { 
      id
      // รับข้อมูลอื่นๆ ที่ต้องการอัปเดตเพิ่มเติม
    } = await req.json();
    console.log("id คือ"+id)
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!id) {
      return new Response(JSON.stringify({ message: 'Bad Request: Leave ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

   
    // อัปเดตข้อมูลใน Firestore
    await db.collection('FormLeave').doc(id).delete();
    // ส่งข้อมูลที่อัปเดตกลับไป
    return new Response(JSON.stringify({ 
      message: 'Leave deleted successfully',  
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error updating leave:', error);
    return new Response(JSON.stringify({ 
      message: 'Internal Server Error', 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}