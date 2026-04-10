import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Download, File, X } from 'lucide-react';
import { resolveFileUrl } from '../../utils/fileUrl';

const Downloads = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileComments, setFileComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [filters, setFilters] = useState({
    year: 'all',
    subject: 'all',
    branch: 'all',
    semester: 'all',
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await api.get('/api/files');
      setFiles(res.data);
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedFile) return;
      setLoadingComments(true);
      try {
        const res = await api.get(`/api/community/files/${selectedFile.id}/comments`);
        setFileComments(res.data);
      } catch (error) {
        console.error(error);
        setFileComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
    setCommentText('');
  }, [selectedFile]);

  const getFilterOptions = (field) => {
    return [...new Set(files.map((file) => file[field]).filter(Boolean))].sort((left, right) =>
      String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' }),
    );
  };

  const matchesFilter = (file) => {
    return ['year', 'subject', 'branch', 'semester'].every((field) => {
      const selectedValue = filters[field];
      if (selectedValue === 'all') return true;
      return String(file[field] || '').toLowerCase() === String(selectedValue).toLowerCase();
    });
  };

  const filteredFiles = files.filter(matchesFilter);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !commentText.trim()) return;

    try {
      const res = await api.post(`/api/community/files/${selectedFile.id}/comments`, {
        comment: commentText.trim(),
      });
      setFileComments((prev) => [res.data, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error(error);
      alert('Failed to post comment');
    }
  };

  const notesFiles = filteredFiles.filter((file) => file.type === 'note');
  const pyqFiles = filteredFiles.filter((file) => file.type === 'pyq');

  const updateFilter = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      year: 'all',
      subject: 'all',
      branch: 'all',
      semester: 'all',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notes & PYQs</h1>
          <p className="text-sm text-gray-500">Browse notes and PYQs separately, then tap a card to read details and comments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
            <label className="space-y-1 text-sm">
              <span className="block font-medium text-gray-700">Year</span>
              <select
                value={filters.year}
                onChange={(e) => updateFilter('year', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="all">All years</option>
                {getFilterOptions('year').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="block font-medium text-gray-700">Subject</span>
              <select
                value={filters.subject}
                onChange={(e) => updateFilter('subject', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="all">All subjects</option>
                {getFilterOptions('subject').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="block font-medium text-gray-700">Branch</span>
              <select
                value={filters.branch}
                onChange={(e) => updateFilter('branch', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="all">All branches</option>
                {getFilterOptions('branch').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="block font-medium text-gray-700">Semester</span>
              <select
                value={filters.semester}
                onChange={(e) => updateFilter('semester', e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="all">All semesters</option>
                {getFilterOptions('semester').map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Notes</h2>
            <p className="text-sm text-gray-500">All notes from the student community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notesFiles.map(file => (
              <button
                type="button"
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="text-left bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <File size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{file.title}</h3>
                    <p className="text-sm text-gray-500 uppercase">{file.type} | {file.category_name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {file.year} · {file.subject} · {file.branch} · {file.semester}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {notesFiles.length === 0 && <p className="text-gray-500 col-span-full text-center">No notes found.</p>}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">PYQs</h2>
            <p className="text-sm text-gray-500">All previous year question papers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pyqFiles.map(file => (
              <button
                type="button"
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="text-left bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <File size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{file.title}</h3>
                    <p className="text-sm text-gray-500 uppercase">{file.type} | {file.category_name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {file.year} · {file.subject} · {file.branch} · {file.semester}
                    </p>
                  </div>
                </div>
              </button>
            ))}
            {pyqFiles.length === 0 && <p className="text-gray-500 col-span-full text-center">No PYQs found.</p>}
          </div>
        </section>
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
                    <File size={34} />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {selectedFile.type}
                    </span>
                    <h2 className="text-3xl font-bold mt-3 text-gray-900">{selectedFile.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedFile.category_name}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-gray-600">
                      <span className="px-3 py-1 rounded-full bg-gray-100">{selectedFile.year}</span>
                      <span className="px-3 py-1 rounded-full bg-gray-100">{selectedFile.subject}</span>
                      <span className="px-3 py-1 rounded-full bg-gray-100">{selectedFile.branch}</span>
                      <span className="px-3 py-1 rounded-full bg-gray-100">{selectedFile.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-3">
                  <p className="text-sm text-gray-500">Soft copy / PDF</p>
                  <a
                    href={resolveFileUrl(selectedFile.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <Download size={18} /> Download PDF
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900">Community Reviews</h4>
                  <span className="text-xs font-medium text-gray-500">Student comments</span>
                </div>

                <form onSubmit={handleCommentSubmit} className="space-y-3 mb-5">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a review or comment about this note/PYQ..."
                    className="w-full min-h-28 p-3 border rounded-xl resize-y"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Comment
                  </button>
                </form>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {loadingComments ? (
                    <p className="text-sm text-gray-500">Loading comments...</p>
                  ) : fileComments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet. Start the discussion.</p>
                  ) : (
                    fileComments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <strong className="text-sm text-gray-800">{comment.user_name}</strong>
                          <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{comment.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Downloads;
