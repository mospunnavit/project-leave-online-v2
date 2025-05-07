'use client';
import { useEffect, useState } from 'react';
import { QueryDocumentSnapshot, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { Leave } from '@/app/types/formleave';



export default function TestFirebase() {
  const [docs, setDocs] = useState<Leave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<String>('');
  const [lastDocIds, setLastDocIds] = useState<DocumentSnapshot[]>([]); // Store IDs of last docs for each page
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 5;

  const fetchData = async (lastDocId: DocumentSnapshot<DocumentData, DocumentData> | null = null, isPrevious = false) => {
    try {
      setLoading(true);
      let url = `/api/user/getleave?email=Test1&limit=${limit}`;
      
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
    const loadInitialData = async () => {
      const lastVisible = await fetchData();
      if (lastVisible) {
        setLastDocIds([lastVisible]);
      }
    };
    
    loadInitialData();
  }, []);

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
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Firebase Data</h1>
      <table className="min-w-full border border-collapse border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Leave Fields</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.id}>
              <td className="border px-4 py-2">{doc.email}</td>
              <td className="border px-4 py-2">{doc.leaveFields.map((leave, index) => (
                <div key={index}>
                  วันที่ลา: {leave.date}, จำนวนวันลา: {leave.days}
                </div>
              ))}</td>
              <td className="border px-4 py-2">{doc.reason}</td>
              <td className="border px-4 py-2">
                {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : 'N/A'}
              </td>
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
  );
}