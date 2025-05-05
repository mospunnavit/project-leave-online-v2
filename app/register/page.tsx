"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, redirect } from 'next/navigation'


function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setcPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

  
    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault();
        if (password != cpassword) {
            setError("Password do not match!");
            return;
        }

        if ( !email || !password || !cpassword) {
            setError("Please complete all inputs.");
            return;
        }

        try{
            const resCheck = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/checkuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email
                })
            })

            const {user} = await resCheck.json();

            if(user){
                setError("User already exist!");
                console.log(user);
                return;
            }

            const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    cpassword
                })
            });
            if(res.ok){
                router.push("/login");
            }
        }catch(err){
            console.log(err);
        }
    }
  return (
            <div className='flex-grow'>
                <div className="flex justify-center items-center min-h-screen">
                    <div className='w-[450px] shadow-xl p-10 mt-5 rounded-xl st border-black border-2 '>
                    <div className="flex justify-center mb-5">
                        <h3 className="text-3xl">สมัคร</h3>
                        </div>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>
                            {error && <p className='text-red-500'>{error}</p>}
                            <label htmlFor="">ชื่อผู้ใช้</label>
                            <input type="text" onChange={(e) => setEmail(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your email' />
                            <label htmlFor="">รหัสผ่าน</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
                            <label htmlFor="">ใส่รหัสผ่านอีกครั้ง</label>
                            <input type="password" onChange={(e) => setcPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
                            <div className='flex justify-end'>
                                
                            
                            <button type='submit' className='bg-blue-500 text-white border py-2 px-3 rounded text-lg my-2 mt-5'>สมัคร</button>
                             </div>
                        </form>
                        <hr className='my-3' />
                        <p>Go to <Link href="/register" className='text-blue-500 hover:underline'>Register</Link> Page</p>
                    </div>
                </div>
            </div>
  )
}

export default RegisterPage