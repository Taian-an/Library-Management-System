import { useState, useEffect } from 'react';
import type { Book, BorrowRequest } from '../types';

export default function AdminPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [, setReqs] = useState<BorrowRequest[]>([]);
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    quantity: 0,
    location: ''
  });

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

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(newBook),
    });

    if (res.ok) {
      alert('Book added successfully!');
      setNewBook({ title: '', author: '', quantity: 0, location: '' }); 
      refresh(); 
    } else {
      alert('Failed to add book');
    }
  };

  const deleteBook = async (id: string) => {
    await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    refresh();
  };

  return (
    <div className="p-4">
      <h2>Admin Dashboard</h2>

      <section className="mb-8 p-4 border rounded bg-gray-50">
        <h3 className="font-bold mb-4 text-blue-700">Add New Book</h3>
        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Book Title" required className="border p-2 rounded"
            value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})}
          />
          <input 
            type="text" placeholder="Author" required className="border p-2 rounded"
            value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})}
          />
          <input 
            type="number" placeholder="Quantity" required className="border p-2 rounded"
            value={newBook.quantity} onChange={e => setNewBook({...newBook, quantity: parseInt(e.target.value) || 0})}
          />
          <input 
            type="text" placeholder="Location (e.g., A1)" required className="border p-2 rounded"
            value={newBook.location} onChange={e => setNewBook({...newBook, location: e.target.value})}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2">
            Create Book
          </button>
        </form>
      </section>

      <h3 className="font-bold mb-2">Books Inventory</h3>
      <div className="space-y-2">
        {books.map(b => (
          <div key={b._id} className="flex justify-between p-2 border-b">
            <span style={{ color: b.status === 'deleted' ? 'red' : 'black' }}>
              {b.title} ({b.author}) - {b.status}
            </span>
            {b.status !== 'deleted' && (
              <button onClick={() => deleteBook(b._id)} className="text-red-500 underline text-sm">Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}