import { useState, useEffect } from 'react';
import type { Book, BorrowRequest } from '../types';

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [reqs, setReqs] = useState<BorrowRequest[]>([]);
  
  const [newBook, setNewBook] = useState({ title: '', author: '', quantity: 0, location: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const refresh = async () => {
    const token = localStorage.getItem('token');
    const bRes = await fetch('/api/books', { headers: { 'Authorization': `Bearer ${token}` } });
    const bData: unknown = await bRes.json();
    setBooks(bData as Book[]);

    const rRes = await fetch('/api/borrow', { headers: { 'Authorization': `Bearer ${token}` } });
    const rData: unknown = await rRes.json();
    setReqs(rData as BorrowRequest[]);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh(); }, []);

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const url = editingId ? `/api/books/${editingId}` : '/api/books';

    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(newBook),
    });

    if (res.ok) {
      alert(editingId ? 'Book updated!' : 'Book added!');
      setNewBook({ title: '', author: '', quantity: 0, location: '' });
      setEditingId(null);
      refresh();
    }
  };

  const deleteBook = async (id: string) => {
    if (!confirm("Confirm soft delete?")) return;
    await fetch(`/api/books/${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    refresh();
  };

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    const res = await fetch('/api/borrow', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ requestId, status: newStatus }),
    });

    if (res.ok) {
      alert(`Status updated to ${newStatus}`);
      refresh();
    }
  };

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold border-b pb-2">Admin Dashboard</h2>

      <section className="p-4 border rounded bg-blue-50 shadow-sm">
        <h3 className="font-bold mb-4 text-blue-700">{editingId ? '📝 Edit Book' : '➕ Add New Book'}</h3>
        <form onSubmit={handleSaveBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Title" required className="border p-2 rounded" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
          <input type="text" placeholder="Author" required className="border p-2 rounded" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
          <input type="number" placeholder="Qty" required className="border p-2 rounded" value={newBook.quantity} onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value) || 0})} />
          <input type="text" placeholder="Loc" required className="border p-2 rounded" value={newBook.location} onChange={e => setNewBook({...newBook, location: e.target.value})} />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Save Book</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setNewBook({title:'', author:'', quantity:0, location:''}); }} className="bg-gray-500 text-white px-6 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </section>

      <section>
        <h3 className="font-bold mb-4 text-indigo-700">📚 Books Inventory</h3>
        <div className="space-y-2">
          {books.map(b => (
            <div key={b._id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50">
              <span className={b.status === 'deleted' ? 'text-red-500 line-through' : 'text-gray-800'}>
                <strong>{b.title}</strong> by {b.author} | Qty: {b.quantity} | Loc: {b.location} | [{b.status}]
              </span>
              <div className="flex gap-3">
                {b.status !== 'deleted' && (
                  <>
                    <button onClick={() => { setEditingId(b._id); setNewBook({title: b.title, author: b.author, quantity: b.quantity, location: b.location}); }} className="text-blue-600 underline text-sm">Edit</button>
                    <button onClick={() => deleteBook(b._id)} className="text-red-500 underline text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 border rounded bg-green-50 shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-green-700">📋 Borrowing Requests</h3>
        <div className="space-y-4">
          {reqs.length === 0 ? <p className="text-gray-500 italic">No requests found.</p> : reqs.map(r => (
            <div key={r._id} className="p-4 border-l-4 border-green-500 bg-white rounded flex justify-between items-center shadow-sm">
              <div>
                <p className="text-sm"><strong>User:</strong> {r.userId}</p>
                <p className="text-sm"><strong>Target:</strong> {new Date(r.targetDate).toLocaleDateString()}</p>
                <p className="text-sm"><strong>Status:</strong> <span className="font-bold text-orange-600">{r.status}</span></p>
              </div>
              {r.status === 'INIT' && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatusUpdate(r._id, 'ACCEPTED')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">Accept</button>
                  <button onClick={() => handleStatusUpdate(r._id, 'CANCEL-ADMIN')} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}