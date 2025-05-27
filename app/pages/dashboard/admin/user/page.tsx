'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { Users } from "@/app/types/users";
import { X } from "lucide-react";
import { Loading } from "@/app/components/loading";



const approveDashboard = () => {
    const [docs, setDocs] = useState<Users[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { data: session, status } = useSession();    
    const [today, setToday] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
    const [currentUser, setcurrentUser] = useState<Users | null>(null);
    const [password, setPassword] = useState<string>('');
    const [retypepassword, setRetypePassword] = useState<string>('');
    
 const handleEdit = (user: Users) => {
    setcurrentUser({...user});
    setIsEditModalOpen(true);
  };

  const handleEditPassword = (user: Users) => {
    setPassword('');
    setRetypePassword('');
    setcurrentUser({...user});
    setIsEditPasswordModalOpen(true);
  }
  // Function สำหรับลบข้อมูล
  const handleDelete = (id: string) => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการนี้?")) {
      setDocs(docs.filter(doc => doc.id !== id));
    }
  };
   const handleSaveEditPassword = async () => {
    
  if (!currentUser) return;
  console.log(currentUser)
  // อัปเดต state ภายในแอพ
  if (password !== retypepassword) {
    setError('รหัสผ่านไม่ตรงกัน');
    setIsEditPasswordModalOpen(false);
    return;
  }
  
  // ลอง-จับข้อผิดพลาด สำหรับการเรียก API
  try {
    // ใช้ async/await เพื่อรอการตอบกลับจาก API
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v2/admin/edituserbyID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ส่งข้อมูลทั้งหมดใน currentUser ไปใน body
      body: JSON.stringify({
        id: currentUser.id,
        password: password,
        cpassword: retypepassword
        // สามารถเพิ่ม field อื่นๆ จาก currentUser ที่นี่ถ้าต้องการ
      })
    });
    
    // ตรวจสอบว่า response เป็น OK หรือไม่
    if (!response.ok) {
      setError(error);
      throw new Error(`API responded with status: ${response.status}`);
    }
    setDocs(docs.map(doc => 
    doc.id === currentUser.id ? currentUser : doc
    ));
    // แปลง response เป็น JSON
    setLoading(true);
    const result = await response.json();
    console.log('Updated successfully:', result);
    
    // อาจแสดง toast หรือการแจ้งเตือนว่าอัปเดตสำเร็จ
    // toast.success('บันทึกการแก้ไขเรียบร้อย');
    
  } catch (error) {
    setError('API error: ' + (error || 'Unknown error'));
    
    // อาจแสดง toast หรือการแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    // toast.error('ไม่สามารถบันทึกการแก้ไขได้');
  } finally {
    // ไม่ว่าจะสำเร็จหรือล้มเหลว ให้ปิด modal และล้างค่า currentUser
    setIsEditModalOpen(false);
    setLoading(false);
    setcurrentUser(null);
  }
};
  // Function สำหรับบันทึกการแก้ไข
  const handleSaveEdit = async () => {

  if (!currentUser) return;
  console.log(currentUser)
  // อัปเดต state ภายในแอพ

  
  // ลอง-จับข้อผิดพลาด สำหรับการเรียก API
  try {
    // ใช้ async/await เพื่อรอการตอบกลับจาก API
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v2/admin/edituserbyID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ส่งข้อมูลทั้งหมดใน currentUser ไปใน body
      body: JSON.stringify({
        id: currentUser.id,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        department: currentUser.department,
        role: currentUser.role
        // สามารถเพิ่ม field อื่นๆ จาก currentUser ที่นี่ถ้าต้องการ
      })
    });
    
    // ตรวจสอบว่า response เป็น OK หรือไม่
    if (!response.ok) {
      setError(error);
      throw new Error(`API responded with status: ${response.status}`);
    }

    // แปลง response เป็น JSON
    setLoading(true);
    const result = await response.json();
    fetchUserData();
    
    // อาจแสดง toast หรือการแจ้งเตือนว่าอัปเดตสำเร็จ
    // toast.success('บันทึกการแก้ไขเรียบร้อย');
    
  } catch (error) {
    setError('API error: ' + (error || 'Unknown error'));
    
    // อาจแสดง toast หรือการแจ้งเตือนเมื่อเกิดข้อผิดพลาด
    // toast.error('ไม่สามารถบันทึกการแก้ไขได้');
  } finally {
    // ไม่ว่าจะสำเร็จหรือล้มเหลว ให้ปิด modal และล้างค่า currentUser
    setIsEditModalOpen(false);
    setLoading(false);
    setcurrentUser(null);
  }
};

  // Function สำหรับจัดการการเปลี่ยนแปลงข้อมูลใน form แก้ไข
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!currentUser) return;
    
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setcurrentUser({
        ...currentUser,
        [parent]: {
          ...currentUser[parent as keyof Users] as object,
          [child]: value
        }
      });
    } else {
      setcurrentUser({
        ...currentUser,
        [name]: value
      });
    }
  };

   const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/admin/getalluser?page=${currentPage}`);
        const data = await res.json();
        setDocs(data.datauser);
        setHasMore(data.length < 5);
        console.log(data);
      } catch (err) {
        console.error('Error fetching leave data', err);
      } finally {
        setLoading(false);
      }
    };


 useEffect(() => {
    fetchUserData();
  }, [currentPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => prev + 1);
    
    
   
      if (loading && docs.length === 0) return <Loading/>;
  return (
    <DashboardLayout title={`admin ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
         {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
       <div className="flex w-full text-xl font-bold mb-4 mr-65">  วัน ณ ปัจจุบัน {today} </div>
        
       <div className="flex flex-row flex-wrap gap-4 ">
            
            
       </div>
       <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                <th className="border px-4 py-2">ชื่อผู้ใช้</th>
                <th className="border px-4 py-2">ขื่อจริง</th>
                  <th className="border px-4 py-2">นามสกุล</th>
                  <th className="border px-4 py-2">แผนก</th>
                  <th className="border px-4 py-2">สิทธิ์</th>
                  <th className="border px-4 py-2 w-40"> การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{doc.username}</td>
                    <td className="border px-4 py-2">{doc.firstname}</td>
                    <td className="border px-4 py-2">{doc.lastname}</td>
                    <td className="border px-4 py-2">{doc.department}</td>
                    <td className="border px-4 py-2">{doc.role}</td>
                    <td> 
                    <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(doc)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleEditPassword(doc)}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                          >
                            รหัส
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            ลบ
                          </button>
                    </div>
                    </td>
                   
                  
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">แก้ไขข้อมูลผ้ใช้</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                <input
                  type="text"
                  name="firstname"
                  value={currentUser.firstname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล</label>
                <input
                  type="text"
                  name="lastname"
                  value={currentUser.lastname}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                 <input
                  type="text"
                  name="department"
                  value={currentUser.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">สิทธิ์</label>
                <input
                  type="text"
                  name="role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
             
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditPasswordModalOpen && currentUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">แก้ไขรหัสผ่านผู้ใช้ {currentUser.username}</h2>
              <button 
                onClick={() => setIsEditPasswordModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ใส่รหัสผ่านใหม่อีกครั้ง</label>
                <input
                  type="password"
                  value={retypepassword}
                  onChange={(e) => setRetypePassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              
             
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
              <button
               onClick={handleSaveEditPassword}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                บันทึก
               
              </button>
            </div>
          </div>
        </div>
      )}
          {/* การ์ดประวัติการลาสำหรับหน้าจอขนาดเล็ก */}
          <div className="md:hidden space-y-4">
            {docs.map((doc, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{doc.username}</span>
                  <span className="px-2 py-1 rounded text-xs font-medium 
                  bg-green-100 text-green-800">
                    {doc.firstname}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">ชื่อ</p>
                    <p>{doc.firstname}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">นามสกุล</p>
                    <p>{doc.lastname}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">แผนก</p>
                    <p>{doc.department}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">สิทธิ</p>
                    <p>{doc.role}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {docs.length === 0 && !loading && (
              <p className="text-center py-4 text-gray-500">
                ไม่พบข้อมูลประวัติการลา
                </p>
            )}
          </div>
          
          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={handlePrev}
              disabled={currentPage <= 0 || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                currentPage == 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ก่อนหน้า
            </button>
            
            <span className="self-center text-sm">หน้า {currentPage }</span>
            
           <button 
              onClick={handleNext}
              disabled={hasMore}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                hasMore || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ถัดไป
            </button>
          </div>
          
         {loading && (
          <Loading/>
        )}
                  
      </div>


      
    </DashboardLayout>
  );
};

export default approveDashboard;
