import { useState, useEffect } from 'react';
import type { Book } from '../types';

export default function UserPanel() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState({ title: '', author: '' });
  const [targetDate, setTargetDate] = useState<string>('');

  const fetchBooks = async () => {
    const query = new URLSearchParams(search).toString();
    const res = await fetch(`/api/books?${query}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    
    const data: unknown = await res.json();
    setBooks(data as Book[]);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBooks();
  }, [search]); 

  const handleBorrow = async (bookId: string) => {
    if (!targetDate) {
      alert("Please select a target date");
      return;
    }

    const res = await fetch('/api/borrow', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ 
        bookId, 
        targetDate 
      })
    });

    const result: unknown = await res.json();
    const typedResult = result as { message?: string };

    if (res.ok) {
      alert('Borrowing request submitted! Status: INIT'); // [cite: 100, 151]
    } else {
      alert(typedResult.message || 'Failed to submit request');
    }
  };

  return (
    <div className="user-panel p-4">
      <h2 className="text-xl font-bold mb-4">Library Catalog</h2>

      <section className="search-section flex gap-4 mb-6">
        <input 
          type="text"
          placeholder="Filter by Title" 
          className="border p-2 rounded"
          onChange={e => setSearch({...search, title: e.target.value})} 
        />
        <input 
          type="text"
          placeholder="Filter by Author" 
          className="border p-2 rounded"
          onChange={e => setSearch({...search, author: e.target.value})} 
        />
      </section>

      <div className="date-picker mb-6">
        <label className="block mb-1 font-medium">Target Pick-up Date:</label>
        <input 
          type="date" 
          className="border p-2 rounded"
          onChange={e => setTargetDate(e.target.value)} 
        />
      </div>

      <div className="book-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((book) => (
          <div key={book._id} className="book-card border p-4 rounded shadow-sm bg-white">
            <div className="info mb-4">
              <h4 className="text-lg font-bold">{book.title}</h4>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-sm text-gray-500">Location: {book.location}</p>
              <p className="text-sm text-gray-500">Available: {book.quantity}</p>
            </div>
            
            <button 
              onClick={() => handleBorrow(book._id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Request to Borrow
            </button>
          </div>
        ))}
        {books.length === 0 && <p className="text-gray-500">No books found matching your search.</p>}
      </div>
    </div>
  );
}