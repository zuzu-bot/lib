import React, { useState, useEffect } from 'react';
import api from '../../api';
import StatCard from '../../components/StatCard';
import { Book, IndianRupee, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  if (!data) return <div>Loading dashboard...</div>;

  const totalFine = data.fines.reduce((sum, f) => sum + parseFloat(f.amount), 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Issued Books" value={data.issuedBooks.length} icon={<Book size={24} />} color="bg-blue-500" />
        <StatCard title="Total Fines" value={`₹${totalFine}`} icon={<IndianRupee size={24} />} color="bg-red-500" />
        <StatCard title="Pending Returns" value={data.issuedBooks.length} icon={<Clock size={24} />} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold">Share Notes & PYQs</h2>
          <p className="text-blue-100 mt-2 mb-4 text-sm">Help your juniors and classmates by uploading your notes and previous year papers.</p>
          <Link
            to="/dashboard/uploads"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-blue-700 font-medium hover:bg-blue-50"
          >
            Open Upload Center
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Currently Issued Books</h2>
          <div className="space-y-4">
            {data.issuedBooks.map(ib => (
              <div key={ib.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-bold">{ib.title}</h3>
                  <p className="text-sm text-gray-500">Due: {new Date(ib.due_date).toLocaleDateString()}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded">Issued</span>
              </div>
            ))}
            {data.issuedBooks.length === 0 && <p className="text-gray-500 text-center">No books currently issued.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Recent Fines</h2>
          <div className="space-y-4">
            {data.fines.map(f => (
              <div key={f.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-red-600">₹{f.amount}</span>
              </div>
            ))}
            {data.fines.length === 0 && <p className="text-gray-500 text-center">No fines yet. Good job!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
