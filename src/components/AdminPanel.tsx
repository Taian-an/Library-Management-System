import { useState, useEffect } from 'react';
import type { Book, BorrowRequest } from '../types';

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [, setReqs] = useState<BorrowRequest[]>([]);

  const refresh = async () => {
    const bRes = await fetch('/api/books', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const bData: unknown = await bRes.json();
    setBooks(bData as Book[]);

    const rRes = await fetch('/api/borrow', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    const rData: unknown = await rRes.json();
    setReqs(rData as BorrowRequest[]);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh(); }, []);

  const deleteBook = async (id: string) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    refresh();
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Books</h3>
      {books.map(b => (
        <div key={b._id} style={{ color: b.status === 'deleted' ? 'red' : 'black' }}>
          {b.title} - {b.status} [cite: 76]
          {b.status !== 'deleted' && <button onClick={() => deleteBook(b._id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
}