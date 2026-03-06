import { useState, useEffect } from 'react';
import type { Book } from '../types';

export default function UserPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState({ title: '', author: '' });
  const [targetDate, setTargetDate] = useState<string>('');

  const fetchBooks = async () => {
    try {
      const query = new URLSearchParams(search).toString();
      const res = await fetch(`/api/books?${query}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data: unknown = await res.json();
      setBooks(data as Book[]);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]); 

  const handleBorrow = async (bookId: string) => {
    if (!targetDate) {
      alert("Please select a target date before borrowing.");
      return;
    }

    const res = await fetch('/api/borrow', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ bookId, targetDate })
    });

    if (res.ok) {
      alert('Borrowing request submitted! Status: INIT');
    } else {
      const result: unknown = await res.json();
      const typedResult = result as { message?: string };
      alert(typedResult.message || 'Failed to submit request');
    }
  };

  return (
    <div className="user-panel p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Library Catalog</h2>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Title</label>
          <input 
            type="text"
            placeholder="e.g. Java Programming" 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setSearch({...search, title: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search by Author</label>
          <input 
            type="text"
            placeholder="e.g. Taian Chen" 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={e => setSearch({...search, author: e.target.value})} 
          />
        </div>
      </section>

      <div className="mb-8 p-4 bg-blue-50 rounded-md border border-blue-200">
        <label className="block mb-2 font-bold text-blue-900">Step 1: Select Target Pick-up Date</label>
        <input 
          type="date" 
          className="border border-blue-300 p-2 rounded w-full md:w-auto"
          value={targetDate}
          onChange={e => setTargetDate(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="border p-4 rounded-xl hover:shadow-lg transition-shadow bg-gray-50">
            <h4 className="text-lg font-bold text-gray-800">{book.title}</h4>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>👤 Author: {book.author}</p>
              <p>📍 Location: {book.location}</p>
              <p>📚 Available: <span className="font-semibold text-green-600">{book.quantity}</span></p>
            </div>
            
            <button 
              onClick={() => handleBorrow(book._id)}
              disabled={book.quantity <= 0}
              className={`w-full mt-4 py-2 rounded-lg font-semibold transition ${
                book.quantity > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {book.quantity > 0 ? 'Request to Borrow' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No books found matching your current filters.
        </div>
      )}
    </div>
  );
}