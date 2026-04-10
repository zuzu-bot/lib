import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Upload, Trash2, File } from 'lucide-react';

const FileManagement = () => {
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'note',
    category_id: '',
    year: '',
    subject: '',
    branch: '',
    semester: '',
    file: null,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFiles();
    fetchCategories();
  }, []);

  const fetchFiles = async () => {
    const res = await api.get('/api/files');
    setFiles(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/api/books/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('category_id', formData.category_id);
    data.append('year', formData.year);
    data.append('subject', formData.subject);
    data.append('branch', formData.branch);
    data.append('semester', formData.semester);
    data.append('file', formData.file);

    try {
      await api.post('/api/files/upload', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setShowModal(false);
      setFormData({ title: '', type: 'note', category_id: '', year: '', subject: '', branch: '', semester: '', file: null });
      fetchFiles();
    } catch (err) {
      alert('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    }
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      setIsAddingCategory(true);
      const res = await api.post(
        '/api/books/categories',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData((prev) => ({ ...prev, category_id: String(res.data.id) }));
      setNewCategoryName('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes & PYQ Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Upload size={20} /> Upload PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map(file => (
          <div key={file.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded">
                <File size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{file.title}</h3>
                <p className="text-xs text-gray-500 uppercase">{file.type} | {file.category_name}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(file.id)} className="text-gray-400 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {files.length === 0 && <p className="text-gray-500 col-span-full text-center">No files uploaded yet.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" className="w-full p-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <select className="w-full p-2 border rounded" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="note">Note</option>
                <option value="pyq">PYQ</option>
              </select>
              <div className="space-y-2">
                <select className="w-full p-2 border rounded" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New category"
                    className="w-full p-2 border rounded"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={isAddingCategory || !newCategoryName.trim()}
                    className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
              <input type="text" placeholder="Year (e.g. 2nd Year)" className="w-full p-2 border rounded" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
              <input type="text" placeholder="Subject" className="w-full p-2 border rounded" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
              <input type="text" placeholder="Branch" className="w-full p-2 border rounded" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} required />
              <input type="text" placeholder="Semester (e.g. Semester 3)" className="w-full p-2 border rounded" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} required />
              <input type="file" accept="application/pdf" className="w-full" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagement;
