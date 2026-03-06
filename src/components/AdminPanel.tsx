import { useState, useEffect } from 'react';
import type { Book, BorrowRequest } from '../types';

export default function AdminPanel() {
  const [books] = useState<Book[]>([]);
  const [reqs, setReqs] = useState<BorrowRequest[]>([]);

  const refresh = async () => {
  const token = localStorage.getItem('token');
  
  const rRes = await fetch('/api/borrow', { 
    headers: { 'Authorization': `Bearer ${token}` } 
  });

  if (rRes.ok && rRes.status !== 204) {
    const rData: unknown = await rRes.json();
    setReqs(rData as BorrowRequest[]);
  } else {
    setReqs([]); 
  }
};

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(); 
  }, []);

  const deleteBook = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to soft-delete this book?");
    if (!confirmDelete) return;

    await fetch(`/api/books/${id}`, { 
      method: 'DELETE', 
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
    });
    refresh();
  };

  return (
    <div className="admin-panel p-6 space-y-8">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-2">Admin Dashboard</h2>

      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-indigo-700">📚 Books Inventory</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map(b => (
                <tr key={b._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      b.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {b.status !== 'deleted' && (
                      <button 
                        onClick={() => deleteBook(b._id)}
                        className="text-red-600 hover:text-red-900 font-bold"
                      >
                        Soft Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-green-700">📋 Borrowing Requests</h3>
        <div className="grid grid-cols-1 gap-4">
          {reqs.length === 0 ? (
            <p className="text-gray-500 italic">No borrow requests found.</p>
          ) : (
            reqs.map(r => (
              <div key={r._id} className="border-l-4 border-green-500 p-4 bg-green-50 rounded">
                <p><strong>User ID:</strong> {r.userId}</p>
                <p><strong>Target Date:</strong> {new Date(r.targetDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span className="font-mono">{r.status}</span></p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}