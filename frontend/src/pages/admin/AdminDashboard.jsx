import React, { useState, useEffect } from 'react';
import api from '../../api';
import StatCard from '../../components/StatCard';
import { Book, Users, BookOpen, IndianRupee } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading stats...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Books" value={stats.totalBooks} icon={<BookOpen size={24} />} color="bg-blue-500" />
        <StatCard title="Issued Books" value={stats.issuedBooks} icon={<Book size={24} />} color="bg-orange-500" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} color="bg-green-500" />
        <StatCard title="Fines Collected" value={`₹${stats.totalFines}`} icon={<IndianRupee size={24} />} color="bg-red-500" />
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Quick Overview</h2>
        <p className="text-gray-600">Welcome back, Admin. Here's what's happening in the library today.</p>
        {/* We can add a chart or recent activity here later */}
      </div>
    </div>
  );
};

export default AdminDashboard;
