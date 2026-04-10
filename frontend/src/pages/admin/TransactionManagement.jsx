import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { Check } from 'lucide-react';

const TransactionManagement = () => {
  const [requests, setRequests] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueData, setIssueData] = useState({ user_id: '', book_id: '', due_date: '' });

  const token = localStorage.getItem('token');

  const fetchRequests = useCallback(async () => {
    const res = await api.get('/api/transactions/requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRequests(res.data);
  }, [token]);

  const fetchIssuedBooks = useCallback(async () => {
    const res = await api.get('/api/transactions/issued', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIssuedBooks(res.data);
  }, [token]);

  const fetchStudents = useCallback(async () => {
    const res = await api.get('/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(res.data);
  }, [token]);

  const fetchBooks = useCallback(async () => {
    const res = await api.get('/api/books');
    setBooks(res.data);
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchIssuedBooks();
    fetchStudents();
    fetchBooks();
  }, [fetchRequests, fetchIssuedBooks, fetchStudents, fetchBooks]);

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/transactions/issue', issueData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowIssueModal(false);
      fetchRequests();
      fetchIssuedBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to issue book');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.post('/api/transactions/return', { issued_book_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchIssuedBooks();
    } catch (err) {
      alert('Failed to return book');
    }
  };

  const handleApproveRequest = (req) => {
    setIssueData({
      user_id: req.user_id,
      book_id: req.book_id,
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days default
    });
    setShowIssueModal(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Issue Requests</h2>
          <button onClick={() => setShowIssueModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Manual Issue</button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Enrollment No.</th>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(req => (
                <tr key={req.id}>
                  <td className="px-6 py-4">{req.user_name}</td>
                  <td className="px-6 py-4">{req.user_enrollment_no || 'N/A'}</td>
                  <td className="px-6 py-4">{req.title}</td>
                  <td className="px-6 py-4">{new Date(req.request_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApproveRequest(req)}
                      className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      <Check size={16} /> Accept
                    </button>
                    {/* Rejection logic can be added */}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No pending requests</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Issued Books</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Enrollment No.</th>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issuedBooks.map(ib => (
                <tr key={ib.id}>
                  <td className="px-6 py-4">{ib.user_name}</td>
                  <td className="px-6 py-4">{ib.user_enrollment_no || 'N/A'}</td>
                  <td className="px-6 py-4">{ib.title}</td>
                  <td className="px-6 py-4">{new Date(ib.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${ib.status === 'issued' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                      {ib.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {ib.status === 'issued' && (
                      <button onClick={() => handleReturn(ib.id)} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">Return</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Issue Book</h2>
            <form onSubmit={handleIssue} className="space-y-4">
              <select className="w-full p-2 border rounded" value={issueData.user_id} onChange={(e) => setIssueData({ ...issueData, user_id: e.target.value })} required>
                <option value="">Select Student</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.enrollment_no || 'N/A'})</option>)}
              </select>
              <select className="w-full p-2 border rounded" value={issueData.book_id} onChange={(e) => setIssueData({ ...issueData, book_id: e.target.value })} required>
                <option value="">Select Book</option>
                {books.map(b => <option key={b.id} value={b.id} disabled={b.available_quantity <= 0}>{b.title} ({b.available_quantity} left)</option>)}
              </select>
              <input type="date" className="w-full p-2 border rounded" value={issueData.due_date} onChange={(e) => setIssueData({ ...issueData, due_date: e.target.value })} required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
