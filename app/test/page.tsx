'use client'; // ถ้าอยู่ใน app directory

import { db } from '@/firebase/clientApp';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function TestFirebase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colRef = collection(db, 'Users'); // 🔁 ใช้ชื่อ collection ที่คุณมีใน Firestore
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to connect to Firebase.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Firebase Data</h1>
      <ul>
        {docs.map(doc => (
          <li key={doc.id}>{JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
}
