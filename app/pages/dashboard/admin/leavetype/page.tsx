'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Loading } from "@/app/components/loading";
import { Leavetypes } from "@/app/types/leavetypes"; 

const HolidayDashboard = () => {
  const [leavetypeData, setLeavetypeData] = useState<Leavetypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const { data: session, status } = useSession();    
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddLeavetypeModalOpen, setIsAddLeavetypeModalOpen] = useState(false);
  const [currentLeavetype, setCurrentLeavetype] = useState<Leavetypes | null>(null);
  
  // Form states for add/edit
  const [formData, setFormData] = useState({
    lt_code: '',
    lt_name: '',
    quotaperyear: 0
  });

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leavetypeData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leavetypeData.length / itemsPerPage);
  
  // Fetch leavetype data
  const fetchLeavetypeData = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/shared/getleavetypes`);
      const data = await res.json();
      if (res.ok) { 
        if (data.dataleavetypes.length === 0) {
          setError('ไม่พบข้อมูล');
        } else {
          setLeavetypeData(data.dataleavetypes || []);
          setError(''); 
        }
      } else {
        setError('API error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('API error: ' + (err || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavetypeData();
  }, []);

  // Pagination functions
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getGlobalIndex = (localIndex: number) => {
    return indexOfFirstItem + localIndex + 1;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pageNumbers;
  };

  // CRUD functions
  const handleEdit = (leavetype: Leavetypes) => {
    setCurrentLeavetype(leavetype);
    setFormData({
      lt_code: leavetype.lt_code,
      lt_name: leavetype.lt_name,
      quotaperyear: leavetype.quotaperyear
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (leavetype: Leavetypes) => {
    setCurrentLeavetype(leavetype);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentLeavetype) return;
    
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/deleteleavetype/${currentLeavetype.id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setSuccess('ลบประเภทการลาสำเร็จ');
        fetchLeavetypeData();
        setIsDeleteModalOpen(false);
        setCurrentLeavetype(null);
      } else {
        const data = await res.json();
        setError('เกิดข้อผิดพลาด: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/addleavetype`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('เพิ่มประเภทการลาสำเร็จ');
        fetchLeavetypeData();
        setIsAddLeavetypeModalOpen(false);
        setFormData({ lt_code: '', lt_name: '', quotaperyear: 0 });
        setCurrentPage(1);
      } else {
        const data = await res.json();
        setError('เกิดข้อผิดพลาด: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + err);
    } finally {
      setLoading(false);
      setIsAddLeavetypeModalOpen(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLeavetype) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/editleavetype/${currentLeavetype.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('แก้ไขประเภทการลาสำเร็จ');
        fetchLeavetypeData();
        setIsEditModalOpen(false);
        setCurrentLeavetype(null);
        setFormData({ lt_code: '', lt_name: '', quotaperyear: 0 });
      } else {
        const data = await res.json();
        setError('เกิดข้อผิดพลาด: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + err);
    } finally {
      setLoading(false);
      setIsEditModalOpen(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    console.log(leavetypeData);
  }, [leavetypeData]);

  if (loading && leavetypeData.length === 0) return <Loading/>;

  return (
    <DashboardLayout title={`admin ${session?.user?.role} ${session?.user?.department}`}>
      <div className="bg-white p-4 rounded shadow">
        {/* Error Message */}
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

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded shadow-sm">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">จัดการประเภทการลา</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow"
            onClick={() => setIsAddLeavetypeModalOpen(true)}
          >
            เพิ่มประเภทการลา
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-collapse border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border items-center px-4 py-2 w-16">ลำดับ</th>
                <th className="border items-center px-4 py-2 w-32">รหัสการลา</th>
                <th className="border items-center px-4 py-2">ชื่อ</th>
                <th className="border px-4 py-2 w-32">โควต้าต่อปี</th>
                <th className="border items-center px-4 py-2 w-32">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {leavetypeData.map((leavetype, index) => (
                <tr key={leavetype.id || index}>
                  <td className="border px-4 py-2 text-center">{getGlobalIndex(index)}</td>
                  <td className="border px-4 py-2 text-center">{leavetype.lt_code}</td>
                  <td className="border px-4 py-2">{leavetype.lt_name}</td>
                  <td className="border px-4 py-2 text-center">{leavetype.quotaperyear}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                        onClick={() => handleEdit(leavetype)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                        onClick={() => handleDelete(leavetype)}
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((leavetype, index) => (
            <div key={leavetype.id || index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {getGlobalIndex(index)}
                  </span>
                  <span className="font-medium">{leavetype.lt_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">รหัสการลา</p>
                  <p className="font-medium">{leavetype.lt_code}</p>
                </div>
                <div>
                  <p className="text-gray-500">โควต้าต่อปี</p>
                  <p className="font-medium">{leavetype.quotaperyear}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={() => handleEdit(leavetype)}
                >
                  แก้ไข
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={() => handleDelete(leavetype)}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
          
          {leavetypeData.length === 0 && !loading && (
            <p className="text-center py-4 text-gray-500">
              ไม่พบข้อมูลประเภทการลา
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {leavetypeData.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, leavetypeData.length)} จาก {leavetypeData.length} รายการ
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                หน้าแรก
              </button>
              
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ก่อนหน้า
              </button>
              
              {renderPageNumbers()}
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                ถัดไป
              </button>
              
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                หน้าสุดท้าย
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && currentLeavetype && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">ยืนยันการลบประเภทการลา</h2>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="mb-4">
                คุณต้องการลบประเภทการลา "{currentLeavetype.lt_code} - {currentLeavetype.lt_name}" หรือไม่?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  disabled={loading}
                >
                  {loading ? 'กำลังลบ...' : 'ยืนยัน'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Leavetype Modal */}
        {isAddLeavetypeModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">เพิ่มประเภทการลา</h2>
                <button 
                  onClick={() => setIsAddLeavetypeModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รหัสการลา
                  </label>
                  <input
                    type="text"
                    value={formData.lt_code}
                    onChange={(e) => setFormData({...formData, lt_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="เช่น SL, AL"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ชื่อประเภทการลา
                  </label>
                  <input
                    type="text"
                    value={formData.lt_name}
                    onChange={(e) => setFormData({...formData, lt_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="เช่น ลาป่วย, ลาพักร้อน"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    โควต้าต่อปี
                  </label>
                  <input
                    type="number"
                    value={formData.quotaperyear}
                    onChange={(e) => setFormData({...formData, quotaperyear: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="จำนวนวัน"
                    min="0"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddLeavetypeModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                  >
                    {loading ? 'กำลังเพิ่ม...' : 'เพิ่ม'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Leavetype Modal */}
        {isEditModalOpen && currentLeavetype && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">แก้ไขประเภทการลา</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รหัสการลา
                  </label>
                  <input
                    type="text"
                    value={formData.lt_code}
                    onChange={(e) => setFormData({...formData, lt_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="เช่น SL, AL"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ชื่อประเภทการลา
                  </label>
                  <input
                    type="text"
                    value={formData.lt_name}
                    onChange={(e) => setFormData({...formData, lt_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="เช่น ลาป่วย, ลาพักร้อน"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    โควต้าต่อปี
                  </label>
                  <input
                    type="number"
                    value={formData.quotaperyear}
                    onChange={(e) => setFormData({...formData, quotaperyear: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="จำนวนวัน"
                    min="0"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                  >
                    {loading ? 'กำลังแก้ไข...' : 'บันทึก'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HolidayDashboard;