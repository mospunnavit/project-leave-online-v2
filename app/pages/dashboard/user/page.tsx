'use client';
import DashboardLayout from "@/app/components/dashboardLayout";
import { useEffect, useState } from 'react';
import {DocumentSnapshot, DocumentData } from "firebase/firestore";
import { Leave } from '@/app/types/formleave';
import { useSession } from "next-auth/react";
const UserDashboard = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<String>('');
    const [lastDocIds, setLastDocIds] = useState<DocumentSnapshot[]>([]); // Store IDs of last docs for each page
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { data: session, status } = useSession();
    const limit = 5;
    
    const fetchData = async (lastDocId: DocumentSnapshot<DocumentData, DocumentData> | null = null, isPrevious = false) => {
      try {
        setLoading(true);
        let url = `/api/user/getleave?&limit=${limit}`;
        
        if (lastDocId) {
          url += `&lastDoc=${lastDocId}`;
        }
        
        if (isPrevious) {
          url += '&direction=prev';
        }
        
        const res = await fetch(url);
        const result = await res.json();
        
        if (res.ok) {
          setDocs(result.data || []);

          console.log(result.data);
          console.log(result.lastVisible);
          setHasMore(result.data.length === limit && result.hasMore);
          return result.lastVisible;
        } else {
          setError('API error: ' + (result.error || 'Unknown error'));
          return null;
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to connect to server.');
        return null;
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (status === "loading") return;

  
      const loadInitialData = async () => {
        const lastVisible = await fetchData();
        if (lastVisible) {
          setLastDocIds([lastVisible]);
        }
      };
      
      loadInitialData();
    },  [status]);

    const handleNext = async () => {
      if (!hasMore) return;
      
      const lastVisible = await fetchData(lastDocIds[currentPage]);
      
      if (lastVisible) {
        // If we navigated back and then forward, remove the forward history
        if (currentPage < lastDocIds.length - 1) {
          setLastDocIds(prev => [...prev.slice(0, currentPage + 1), lastVisible]);
        } else {
          setLastDocIds(prev => [...prev, lastVisible]);
        }
        setCurrentPage(prev => prev + 1);
      }
    };

    const handlePrevious = async () => {
      if (currentPage <= 0) return;
      
      const newPage = currentPage - 1;
      const previousLastDocId = newPage > 0 ? lastDocIds[newPage - 1] : null;
      
      await fetchData(previousLastDocId);
      setCurrentPage(newPage);
      setHasMore(true); // When going back, we know there's more forward
    };

    if (loading && docs.length === 0) return <p>Loading...</p>;
  return (
    <DashboardLayout title="Want to Leave">
      <div className="flex flex-col flex-wrap bg-white p-4 rounded shadow">
       <div className="flex flex-row flex-wrap gap-4 ">
          <div className="flex flex-col basis-0 flex-1 min-w-64 bg-white p-4 rounded shadow">
              <label htmlFor="">ชื่อ: {session?.user?.firstname}  {session?.user?.lastname}</label>
              <label htmlFor="">แผนก: {session?.user?.department}</label>
          </div>
          <div className="flex flex-col basis-0 flex-1 min-w-64 bg-white p-4 rounded shadow">ข้อมูลการประเภทการลา
              <table className="min-w-full border border-collapse border-gray-300">
                 <thead>
                  <tr>
                      <th className="border px-4 py-2">ประเภทการลา</th>
                      <th className="border px-4 py-2">ลาได้</th>
                      <th className="border px-4 py-2">ใช้ไปแล้ว</th>
                      <th className="border px-4 py-2">คงเหลือ</th>
                  </tr>
                 </thead>
                 <tbody>
                  <tr>
                    <td className="border px-4 py-2">ลากิจ</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                   </tr>     

                    <tr>
                    <td className="border px-4 py-2">ลาป่วย </td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                     </tr>   
                   <tr>
                    <td className="border px-4 py-2">ลาพักร้อน</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">1</td>
                        <td className="border px-4 py-2">0</td>
                       </tr> 
                    
                  </tbody>
              </table>
          </div>
       </div>
        {/* Content */}
          <div>
        <h1>ข้อมูลประวัติการลา</h1>
        {error && <p>{error}</p>}
        <table className="min-w-full border border-collapse border-gray-300">
          <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2">ชื่อผู้ใช้</th>
                <th className="border px-4 py-2">ชื่อ-นามสกุล</th>
                <th className="border px-4 py-2">ประเภทการลา</th>
                <th className="border px-4 py-2">วันที่ลา</th>
                <th className="border px-4 py-2">ช่วงเวลาที่ลา</th>
                <th className="border px-4 py-2">เหตุผล</th>
                <th className="border px-4 py-2">เวลาที่ส่งฟอร์มาลา</th>
                <th className="border px-4 py-2">สถานะ</th>
                
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{doc.username}</td>
                <td className="border px-4 py-2">{doc.fullname}</td>
                <td className="border px-4 py-2">{doc.selectedLeavetype}</td>
                <td className="border px-4 py-2">{doc.leaveDays}</td>
                <td className="border px-4 py-2">{doc.leaveTime.startTime} - {doc.leaveTime.endTime}</td>
                <td className="border px-4 py-2">{doc.reason}</td>
                <td className="border px-4 py-2">{doc.createdAt}</td>
                <td className= "border px-4 py-">{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        
        <div className="flex justify-between mt-4">
          <button 
            onClick={handlePrevious}
            disabled={currentPage <= 0 || loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              currentPage <= 0 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          
          <span className="self-center">Page {currentPage + 1}</span>
          
          <button 
            onClick={handleNext}
            disabled={!hasMore || loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              !hasMore || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
        
        {loading && <p className="text-center mt-2">Loading...</p>}
      </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;