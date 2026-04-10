import React, { useState } from 'react';
import api from '../../api';
import { User, Save } from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/student/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile Management</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <User size={48} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500 uppercase text-sm tracking-wider">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
