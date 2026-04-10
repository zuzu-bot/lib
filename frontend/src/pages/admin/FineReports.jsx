import React, { useState, useEffect } from 'react';
import api from '../../api';
import { IndianRupee, Filter, Search } from 'lucide-react';

const FineReports = () => {
  const [fines, setFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await api.get('/api/admin/reports/fines');
      setFines(response.data);
    } catch (error) {
      console.error('Error fetching fines:', error);
    }
  };

  const filteredFines = fines.filter(fine => {
    const matchesSearch = fine.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(fine.student_enrollment_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.book_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || fine.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCollected = fines
    .filter(f => f.status === 'paid')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Fine Reports</h1>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold">
          <IndianRupee size={20} />
          Total Collected: ₹{totalCollected.toFixed(2)}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search student or book..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            className="border rounded-lg px-4 py-2 bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Fines</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Student</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Enrollment No.</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Book</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Amount</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFines.map((fine) => (
              <tr key={fine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{fine.student_name}</td>
                <td className="px-6 py-4 text-gray-600">{fine.student_enrollment_no || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-600">{fine.book_title}</td>
                <td className="px-6 py-4 font-bold text-red-600">₹{Number(fine.amount || 0).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(fine.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${fine.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {fine.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FineReports;
