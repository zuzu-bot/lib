import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enrollment_no: '',
    branch: '',
    semester: '',
    batch_year: ''
  });

  const token = localStorage.getItem('token');

  const fetchStudents = useCallback(async () => {
    const res = await api.get('/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(res.data);
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/students/${editingStudent.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      enrollment_no: student.enrollment_no || '',
      branch: student.branch || '',
      semester: student.semester || '',
      batch_year: student.batch_year ? String(student.batch_year) : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will delete the student account.')) {
      await api.delete(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Enrollment No.</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-gray-600">{student.enrollment_no || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(student.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-[520px]">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              <input type="text" placeholder="Enrollment No." className="w-full p-2 border rounded" value={formData.enrollment_no} onChange={(e) => setFormData({ ...formData, enrollment_no: e.target.value })} />
              <div className="md:col-span-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
