import { useState, useEffect } from 'react';
// 修正點：從同目錄或上一層引用 types
import type { Book, BorrowRequest } from '../types';

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [, setReqs] = useState<BorrowRequest[]>([]);

  const refresh = async () => {
    const token = localStorage.getItem('token');
    const bRes = await fetch('/api/books', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    const bData: unknown = await bRes.json();
    // 嚴格斷言，移除 any
    setBooks(bData as Book[]);

    const rRes = await fetch('/api/borrow', { 
      headers: { 'Authorization': `Bearer ${token}` } 
    });
    const rData: unknown = await rRes.json();
    setReqs(rData as BorrowRequest[]);
  };

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(); 
  }, []);

  const deleteBook = async (id: string) => {
    // 實作軟刪除邏輯：API 會將 status 改為 'deleted'
    await fetch(`/api/books/${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    refresh();
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <h3 className="text-lg font-semibold mb-2">Books Management</h3>
      <div className="space-y-2">
        {books.map(b => (
          <div key={b._id} className="flex justify-between items-center p-2 border-b">
            <span style={{ color: b.status === 'deleted' ? 'red' : 'black' }}>
              {b.title} - <small>[{b.status}]</small>
            </span>
            {b.status !== 'deleted' && (
              <button 
                onClick={() => deleteBook(b._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Soft Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}