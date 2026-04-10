import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', category_id: '', isbn: '', quantity: 1, description: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    const res = await api.get('/api/books');
    setBooks(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/api/books/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/api/books/${editingBook.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/api/books', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', category_id: '', isbn: '', quantity: 1, description: '' });
      fetchBooks();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category_id: book.category_id,
      isbn: book.isbn,
      quantity: book.quantity,
      description: book.description
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
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
        <h1 className="text-2xl font-bold">Books Management</h1>
        <button
          onClick={() => { setEditingBook(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Book
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-600">Title</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Author</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Quantity</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Available</th>
              <th className="px-6 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {books.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4">{book.title}</td>
                <td className="px-6 py-4">{book.author}</td>
                <td className="px-6 py-4">{book.category_name}</td>
                <td className="px-6 py-4">{book.quantity}</td>
                <td className="px-6 py-4">{book.available_quantity}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleEdit(book)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" className="w-full p-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              <input type="text" placeholder="Author" className="w-full p-2 border rounded" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} required />
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
              <input type="text" placeholder="ISBN" className="w-full p-2 border rounded" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
              <input type="number" placeholder="Quantity" className="w-full p-2 border rounded" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} required />
              <textarea placeholder="Description" className="w-full p-2 border rounded" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
