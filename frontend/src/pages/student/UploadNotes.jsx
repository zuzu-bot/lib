import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Upload, FileText } from 'lucide-react';
import { resolveFileUrl } from '../../utils/fileUrl';

const initialForm = {
    title: '',
    type: 'note',
    category_id: '',
    year: '',
    subject: '',
    branch: '',
    semester: '',
    file: null,
};

const UploadNotes = () => {
    const [categories, setCategories] = useState([]);
    const [myUploads, setMyUploads] = useState([]);
    const [formData, setFormData] = useState(initialForm);
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/books/categories');
            setCategories(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyUploads = async () => {
        try {
            const res = await api.get('/api/files/my-uploads');
            setMyUploads(res.data);
        } catch (error) {
            console.error(error);
            setMyUploads([]);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchMyUploads();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.file) {
            alert('Please select a PDF file.');
            return;
        }

        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('category_id', formData.category_id);
            data.append('year', formData.year);
            data.append('subject', formData.subject);
            data.append('branch', formData.branch);
            data.append('semester', formData.semester);
            data.append('file', formData.file);

            await api.post('/api/files/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setFormData(initialForm);
            await fetchMyUploads();
            alert('Uploaded successfully.');
        } catch (error) {
            console.error(error);
            alert('Upload failed. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Upload Notes & PYQs</h1>
                <p className="text-sm text-gray-500 mt-1">Share your study resources with other students.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        required
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <select
                        value={formData.type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    >
                        <option value="note">Note</option>
                        <option value="pyq">PYQ</option>
                    </select>

                    <select
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        required
                        placeholder="Year (e.g. 2nd Year)"
                        value={formData.year}
                        onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <input
                        type="text"
                        required
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <input
                        type="text"
                        required
                        placeholder="Branch"
                        value={formData.branch}
                        onChange={(e) => setFormData((prev) => ({ ...prev, branch: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <input
                        type="text"
                        required
                        placeholder="Semester (e.g. Semester 4)"
                        value={formData.semester}
                        onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <input
                        type="file"
                        required
                        accept="application/pdf"
                        onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                        className="w-full p-3 border rounded-lg"
                    />

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        >
                            <Upload size={18} />
                            {saving ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="text-lg font-bold mb-4">My Recent Uploads</h2>
                <div className="space-y-3">
                    {myUploads.map((file) => (
                        <div key={file.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                            <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg mt-0.5">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{file.title}</p>
                                    <p className="text-xs text-gray-500">{file.type.toUpperCase()} · {file.subject} · {file.semester}</p>
                                </div>
                            </div>
                            <a
                                href={resolveFileUrl(file.file_path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap"
                            >
                                View PDF
                            </a>
                        </div>
                    ))}
                    {myUploads.length === 0 && <p className="text-sm text-gray-500">You have not uploaded notes or PYQs yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default UploadNotes;
