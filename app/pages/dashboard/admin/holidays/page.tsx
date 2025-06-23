'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Loading } from "@/app/components/loading";
import { Holiday } from "@/app/types/holiday";

const HolidayDashboard = () => {
  const [holidaydata, setHolidaydata] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
  const { data: session, status } = useSession();    
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null);
  
  // Form states for add/edit
  const [formData, setFormData] = useState({
    holiday_date: '',
    holiday_remark: '',
    is_sunday: false
  });

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = holidaydata.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(holidaydata.length / itemsPerPage);
  
  function convertUTCToThaiDate(utcString: string) {
    const utcDate = new Date(utcString);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const thaiDate = new Intl.DateTimeFormat('en-CA', options).format(utcDate);
    return thaiDate;
  }

  function formatDateForInput(dateString: string) {
    return convertUTCToThaiDate(dateString);
  }
  
  // Fetch holiday data
  const fetchHolidayData = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/getallholidays`);
      const data = await res.json();
      if (res.ok) { 
        setHolidaydata(data.holidays || []);
        console.log("in", data.holidays);
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
    fetchHolidayData();
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
  const handleEdit = (holiday: Holiday) => {
    setCurrentHoliday(holiday);
    setFormData({
      holiday_date: formatDateForInput(holiday.date),
      holiday_remark: holiday.remark,
      is_sunday: holiday.sunday
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (holiday: Holiday) => {
    setCurrentHoliday(holiday);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentHoliday) return;
    
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/deleteholiday/${currentHoliday.id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setSuccess('ลบวันหยุดสำเร็จ');
        fetchHolidayData();
        setIsDeleteModalOpen(false);
        setCurrentHoliday(null);
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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/addholiday`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('เพิ่มวันหยุดสำเร็จ');
        fetchHolidayData();
        setIsAddHolidayModalOpen(false);
        setFormData({ holiday_date: '', holiday_remark: '' , is_sunday: false});
        setCurrentPage(1);
      } else {
        const data = await res.json();
        setError('เกิดข้อผิดพลาด: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด: ' + err);
    } finally {
      setLoading(false);
      setIsAddHolidayModalOpen(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHoliday) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/editholiday/${currentHoliday.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('แก้ไขวันหยุดสำเร็จ');
        fetchHolidayData();
        setIsEditModalOpen(false);
        setCurrentHoliday(null);
        setFormData({ holiday_date: '', holiday_remark: '' , is_sunday: false});

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
    console.log(holidaydata);
  }, [holidaydata]);
  if (loading && holidaydata.length === 0) return <Loading/>;

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
          <h1 className="text-2xl font-bold text-gray-800">จัดการวันหยุด</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow"
            onClick={() => setIsAddHolidayModalOpen(true)}
          >
            เพิ่มวันหยุด
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-collapse border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border items-center px-4 py-2 w-16">ลำดับ</th>
                <th className="border items-center px-4 py-2 w-32">วันที่</th>
                <th className="border items-center px-4 py-2">รายละเอียด</th>
                <th className="border px-4 py-2 w-32">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((holiday, index) => (
                <tr key={holiday.id || index}>
                  <td className="border px-4 py-2 text-center">{getGlobalIndex(index)}</td>
                  <td className="border px-4 py-2 text-center">{convertUTCToThaiDate(holiday.date)}</td>
                  <td className="border px-4 py-2">{holiday.remark}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(holiday)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(holiday)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
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
          {currentItems.map((holiday, index) => (
            <div key={holiday.id || index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {getGlobalIndex(index)}
                  </span>
                  <span className="font-medium">{convertUTCToThaiDate(holiday.date)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">รายละเอียด</p>
                  <p className="font-medium">{holiday.remark}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(holiday)}
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(holiday)}
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
          
          {holidaydata.length === 0 && !loading && (
            <p className="text-center py-4 text-gray-500">
              ไม่พบข้อมูลวันหยุด
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {holidaydata.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, holidaydata.length)} จาก {holidaydata.length} รายการ
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
        {isDeleteModalOpen && currentHoliday && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">ยืนยันการลบวันหยุด</h2>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="mb-4">
                คุณต้องการลบวันหยุด "{convertUTCToThaiDate(currentHoliday.date)} - {currentHoliday.remark}" หรือไม่?
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

        {/* Add Holiday Modal */}
        {isAddHolidayModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">เพิ่มวันหยุด</h2>
                <button 
                  onClick={() => setIsAddHolidayModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    วันที่
                  </label>
                  <input
                    type="date"
                    value={formData.holiday_date}
                    onChange={(e) => setFormData({...formData, holiday_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รายละเอียด
                  </label>
                  <textarea
                    value={formData.holiday_remark}
                    onChange={(e) => setFormData({...formData, holiday_remark: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="ระบุรายละเอียดวันหยุด"
                    required
                  />
                </div>
               <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="is_sunday"
              checked={formData.is_sunday}
              onChange={(e) => setFormData({...formData, is_sunday: e.target.checked})}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="is_sunday" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              เป็นวันอาทิตย์
            </label>
          </div>
        
        </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddHolidayModalOpen(false)}
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

        {/* Edit Holiday Modal */}
        {isEditModalOpen && currentHoliday && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">แก้ไขวันหยุด</h2>
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
                    วันที่
                  </label>
                  <input
                    type="date"
                    value={formData.holiday_date}
                    onChange={(e) => setFormData({...formData, holiday_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รายละเอียด
                  </label>
                  <textarea
                    value={formData.holiday_remark}
                    onChange={(e) => setFormData({...formData, holiday_remark: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="ระบุรายละเอียดวันหยุด"
                    required
                  />
                </div>
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    id="is_sunday"
                    checked={formData.is_sunday}
                    onChange={(e) => setFormData({...formData, is_sunday: e.target.checked})}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="is_sunday" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    เป็นวันอาทิตย์
                  </label>
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