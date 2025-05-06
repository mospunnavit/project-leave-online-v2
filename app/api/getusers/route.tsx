import { NextResponse } from 'next/server';
import { db } from '@/firebase/clientApp';
import { collection, getDocs } from 'firebase/firestore';
export async function GET(req:Request) {
    try{
        const user = collection(db, 'Users');
        const querySnapshot = await getDocs(user);
        
        return NextResponse.json({
            users: querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name,
                email: data.email,
              };
            }),
          }, { status: 200 });


    }catch(err){
        console.log(err);
    }
    
}