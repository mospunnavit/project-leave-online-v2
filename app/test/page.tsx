'use client';
import { useEffect, useState } from 'react';

export default function TestFirebase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user/getleave?email=Test1&limit=5&cursor=2025-05-01T00:00:00.000Z`);
        const result = await res.json();

        if (res.ok) {
          setDocs(result.data || []);
        } else {
          setError('API error: ' + (result.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to connect to server.');
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
        {docs.map((doc) => (
          <li key={doc.email}>{JSON.stringify(doc)}</li>
        ))}
      </ul>
    </div>
  );
}
