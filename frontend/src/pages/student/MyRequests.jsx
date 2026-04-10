import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';

const MyRequests = () => {
    const [books, setBooks] = useState([]);
    const token = localStorage.getItem('token');

    const fetchMyBooks = useCallback(async () => {
        try {
            const res = await api.get('/api/student/my-books', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        fetchMyBooks();
    }, [fetchMyBooks]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Issued Books</h1>
            <p className="text-sm text-gray-500 mb-6">Books currently issued to you and your return history.</p>
            <div className="space-y-4 md:hidden">
                {books.map((book) => (
                    <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                                <p className="text-sm text-gray-500">{book.status}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${book.status === 'issued' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                {book.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                            <div>
                                <p className="text-gray-400 text-xs uppercase">Issue Date</p>
                                <p>{new Date(book.issue_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs uppercase">Due Date</p>
                                <p>{new Date(book.due_date).toLocaleDateString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-400 text-xs uppercase">Return Date</p>
                                <p>{book.return_date ? new Date(book.return_date).toLocaleDateString() : '-'}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {books.length === 0 && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">No books issued yet.</div>}
            </div>

            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">Book Title</th>
                                <th className="px-6 py-3">Issue Date</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3">Return Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books.map(book => (
                                <tr key={book.id}>
                                    <td className="px-6 py-4 font-medium">{book.title}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(book.issue_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(book.due_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{book.return_date ? new Date(book.return_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${book.status === 'issued' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {books.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No books found in your history.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyRequests;
