'use client'
import DashboardLayout from "@/app/components/dashboardLayout";
import { DocumentSnapshot, DocumentData } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { Users } from "@/app/types/users";
import { X } from "lucide-react";
import { Loading } from "@/app/components/loading";
import { Department } from "@/app/types/department";

const DepartmentDashboard = () => {
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const { data: session, status } = useSession();    
  const [today, setToday] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  
  // Form states for add/edit
  const [formData, setFormData] = useState({
    department_code: '',
    department_name: ''
  });

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departmentData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departmentData.length / itemsPerPage);

  // Fetch department data
  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/getalldepartments`);
      const data = await res.json();
      if (res.ok) { 
        setDepartmentData(data.departments || []);
        console.log(data.departments);
      } else {
        setError('API error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setError('API error: ' + (err || 'Unknown error'));
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
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
  const handleEdit = (department: Department) => {
    setCurrentDepartment(department);
    setFormData({
      department_code: department.department_code,
      department_name: department.department_name
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setCurrentDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentDepartment) return;
    
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/deletedepartment/${currentDepartment.id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setSuccess('ลบแผนกสำเร็จ');
        fetchDepartmentData();
        setIsDeleteModalOpen(false);
        setCurrentDepartment(null);
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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/adddepartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('เพิ่มแผนกสำเร็จ');
        fetchDepartmentData();
        setIsAddDepartmentModalOpen(false);
        setFormData({ department_code: '', department_name: '' });
        setCurrentPage(1); // Reset to first page
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

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDepartment) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v2/admin/editdepartmentbyid/${currentDepartment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess('แก้ไขแผนกสำเร็จ');
        fetchDepartmentData();
        setIsEditModalOpen(false);
        setCurrentDepartment(null);
        setFormData({ department_code: '', department_name: '' });
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

  if (loading && departmentData.length === 0) return <Loading/>;

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
        <div className="flex justify-end items-center mb-4">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-40 px-4 py-2 rounded-lg shadow"
            onClick={() => setIsAddDepartmentModalOpen(true)}
          >
            เพิ่มแผนก
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-collapse border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border items-center px-4 py-2 w-16">#</th>
                <th className="border items-center px-4 py-2 w-18">รหัสแผนก</th>
                <th className="border items-center px-4 py-2 w-18">แผนก</th>
                <th className="border px-4 py-2 w-16">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((doc, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{getGlobalIndex(index)}</td>
                  <td className="border px-4 py-2">{doc.department_code}</td>
                  <td className="border px-4 py-2">{doc.department_name}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        แก้ไข
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {currentItems.map((doc, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {getGlobalIndex(index)}
                  </span>
                  <span className="font-medium">{doc.department_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">รหัสแผนก</p>
                  <p className="font-medium">{doc.department_code}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
          
          {departmentData.length === 0 && !loading && (
            <p className="text-center py-4 text-gray-500">
              ไม่พบข้อมูลแผนก
            </p>
          )}
        </div>

        {/* Pagination Controls */}
        {departmentData.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="text-sm text-gray-700">
              แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, departmentData.length)} จาก {departmentData.length} รายการ
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
        {isDeleteModalOpen && currentDepartment && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">ยืนยันการลบแผนก</h2>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="mb-4">คุณต้องการลบแผนก "{currentDepartment.department_name}" หรือไม่?</p>

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

        {/* Add Department Modal */}
        {isAddDepartmentModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">เพิ่มแผนก</h2>
                <button 
                  onClick={() => setIsAddDepartmentModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitAdd}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    รหัสแผนก
                  </label>
                  <input
                    type="text"
                    value={formData.department_code}
                    onChange={(e) => setFormData({...formData, department_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ชื่อแผนก
                  </label>
                  <input
                    type="text"
                    value={formData.department_name}
                    onChange={(e) => setFormData({...formData, department_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddDepartmentModalOpen(false)}
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

        {/* Edit Department Modal */}
        {isEditModalOpen && currentDepartment && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">แก้ไขแผนก</h2>
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
                    รหัสแผนก
                  </label>
                  <input
                    type="text"
                    value={formData.department_code}
                    onChange={(e) => setFormData({...formData, department_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ชื่อแผนก
                  </label>
                  <input
                    type="text"
                    value={formData.department_name}
                    onChange={(e) => setFormData({...formData, department_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
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

export default DepartmentDashboard;