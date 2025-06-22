'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { Users } from "@/app/types/users";
import { X } from "lucide-react";
import { Loading } from "@/app/components/loading";
import { Department } from "@/app/types/department";

const approveDashboard = () => {
    const [departmentData, setDepartmentData] = useState<Department[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { data: session, status } = useSession();    
    const [today, setToday] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdduserModalOpen, setIsAdduserModalOpen] = useState(false);
    const [currentUser, setcurrentUser] = useState<Users | null>(null);
  
    
 


    const fetchDepartmentData = async () => {
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL +`/api/v2/admin/getalldepartments`);
        const data = await res.json();
        if (res.ok){ 
          setDepartmentData(data.departments);
          console.log(data.departments);
        }else{
          setError('API error: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        setError('API error: ' + (err || 'Unknown error'));
        return;
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      fetchDepartmentData();
    }, []);


    
   
      if (loading && departmentData.length === 0) return <Loading/>;
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
        {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
          
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
       <div className="flex w-full justify-end flex-wrap text-xl font-bold gap-4 mb-4 mr-65"> 
          <span className="py-4">รหัสผู้ใช้</span>
          <input type="text" />
          <span className="py-4">แผนก</span>
              <select
        id="department"
        name="department"
        value={selectedDepartment}
        className=" border border-gray-300 rounded-md text-sm"
      >
        <option value="" disabled>
          -- กรุณาเลือกแผนก --
        </option>
        {departmentData.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.department_name}
          </option>
        ))}
      </select>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow">ค้นหา</button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow"
          onClick={() => setIsAdduserModalOpen(true)}>เพิ่มแผนก</button>
        </div>
        
       <div className="flex flex-row flex-wrap gap-4 ">
            
            
       </div>
       <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full border border-collapse border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                <th className="border px-4 py-2 w-64">รหัสแผนก</th>
                <th className="border px-4 py-2  w-64">แผนก</th>
                  <th className="border px-4 py-2  w-32">การจัดการ</th>

                  
                </tr>
              </thead>
              <tbody>
                {departmentData.map((doc, index) => (
                  <tr key={index}>
                    <td className="border ">{doc.department_code}</td>
                    <td className="border px-4 py-2">{doc.department_name}</td>
                  
                    <td className="border px-4 py-2">
                   
                    <div className="flex">
                          <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            แก้ไข
                          </button>
                          <button
                         
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                          >
                            รหัส
                          </button>
                          
                          <button
                           onClick={() => handleDelete(doc)}
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
              <h2 className="text-xl font-bold">แก้ไขข้อมูลผ้ใช้ {currentUser.username}</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
           
          
          
          </div>
        </div>
      )}
      
       {isDeleteModalOpen && currentUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">ยันยันการลบผู้ใช้ {currentUser.username}</h2>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

          

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                ยกเลิก
              </button>
              <button
               onClick={hadleConfirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ยืนยัน
               
              </button>
            </div>
          </div>
        </div>
      )}
          {/* การ์ดประวัติการลาสำหรับหน้าจอขนาดเล็ก */}
          <div className="md:hidden space-y-4">
            {departmentData.map((doc, index) => (
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
            
            {departmentData.length === 0 && !loading && (
              <p className="text-center py-4 text-gray-500">
                ไม่พบข้อมูลประวัติการลา
                </p>
            )}
          </div>
          
          {/* ปุ่มเปลี่ยนหน้า */}
          <div className="flex justify-between mt-6">
            <button 
              disabled={currentPage <= 0 || loading}
              className={`px-4 py-2 bg-blue-500 text-white rounded ${
                currentPage == 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              ก่อนหน้า
            </button>
            
            <span className="self-center text-sm">หน้า {currentPage }</span>
            
          <button 
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
      {isAdduserModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">เพิ่มผู้ใช้</h2>
              <button 
                onClick={() => setIsAdduserModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
       
          </div>
           
        </div>
      )}
      </div>


      
    </DashboardLayout>
  );
};

export default approveDashboard;
