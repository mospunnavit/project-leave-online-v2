"use client"
import React, { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter,  useSearchParams } from 'next/navigation'

import { signIn } from 'next-auth/react'
import { getSession } from 'next-auth/react'
import {Loading } from '@/app/components/loading'

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        
        
        try{
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })
            if(res?.error){
                setLoading(false);
                setError(res.error);
            }else{
                const updatedSession = await getSession(); 
                const role = updatedSession?.user?.role;
                console.log(role)
                setLoading(true);
                if(role === "admin"){
                    router.push("/pages/dashboard/admin");
                }else if(role === "user" || role === "head" || role === "manager" || role === "hr"){
                    router.push("/pages/dashboard/user");
                }else{
                    router.push("/");
                }
            }
        }catch(err){
            setLoading(false);
            console.log(err);
        }
    }
  const  searchParams    = useSearchParams();
   useEffect(() => {
    if (searchParams.get('expired') === '1'){
        setError("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        console.log("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
    }
      
   }, [searchParams])

  return (
            <div className='flex-grow'>
                <div className="flex justify-center items-center min-h-screen">
                    <div className='w-[450px] shadow-xl p-10 mt-5 rounded-xl st border-black border-2 '>
                    <div className="flex justify-center mb-5">
                        <h3 className="text-3xl">เข้าสู่ระบบ</h3>
                        </div>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>
                            {error  && <p className='text-red-500'>{error}</p>}
                            <label htmlFor="">ชื่อผู้ใช้</label>
                            <input type="text" onChange={(e) => setUsername(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your email' />
                            <label htmlFor="">รหัสผ่าน</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
                            <div className='flex justify-end'>
                                
                            
                            <button type='submit' className='bg-blue-500 text-white border py-2 px-3 rounded text-lg my-2 mt-5'>เข้าสู่ระบบ</button>
                             </div>
                        </form>
                        <hr className='my-3' />
                        <p>Go to <Link href="/register" className='text-blue-500 hover:underline'>Register</Link> Page</p>
                    </div>
                </div>
                 {loading && (
                    <Loading/>
                )}
            </div>
            
  )
}
export default LoginPage