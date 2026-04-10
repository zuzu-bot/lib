import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Search, X, MessageSquareText, BookOpenText } from 'lucide-react';

const BookCatalog = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookComments, setBookComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [requestingBookId, setRequestingBookId] = useState(null);
  const [requestedBookIds, setRequestedBookIds] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!selectedBook) return;
      setLoadingComments(true);
      try {
        const res = await api.get(`/api/community/books/${selectedBook.id}/comments`);
        setBookComments(res.data);
      } catch (error) {
        console.error(error);
        setBookComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
    setCommentText('');
  }, [selectedBook]);

  const fetchBooks = async () => {
    const res = await api.get('/api/books');
    setBooks(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/api/books/categories');
    setCategories(res.data);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !commentText.trim()) return;

    try {
      const res = await api.post(`/api/community/books/${selectedBook.id}/comments`, {
        comment: commentText.trim(),
      });
      setBookComments((prev) => [res.data, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error(error);
      alert('Failed to post comment');
    }
  };

  const handleRequestIssue = async () => {
    if (!selectedBook || requestingBookId) return;

    setRequestingBookId(selectedBook.id);
    try {
      await api.post('/api/student/request-issue', { book_id: selectedBook.id });
      setRequestedBookIds((prev) => (prev.includes(selectedBook.id) ? prev : [...prev, selectedBook.id]));
      alert('Request sent successfully. Admin can now accept and issue this book.');
    } catch (error) {
      const message = error?.response?.data?.error || 'Failed to send request';
      if (String(message).toLowerCase().includes('already pending')) {
        setRequestedBookIds((prev) => (prev.includes(selectedBook.id) ? prev : [...prev, selectedBook.id]));
      }
      alert(message);
    } finally {
      setRequestingBookId(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Book Catalog</h1>
          <p className="text-sm text-gray-500">Tap a card to view hardcopy availability and student comments.</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <select
            className="border rounded-lg px-4 py-2 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by book title, author or ISBN"
              className="pl-10 pr-4 py-2 border rounded-lg w-full min-w-[280px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <button
            type="button"
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {book.genre || book.category_name}
                </span>
                <span className="text-[11px] font-medium text-gray-500 inline-flex items-center gap-1">
                  <BookOpenText size={14} /> Open
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-gray-500 text-sm mb-4">by {book.author}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {book.description || 'No description available.'}
              </p>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <span className={`text-xs font-medium ${book.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.available_quantity > 0 ? `${book.available_quantity} hardcopies available in SATI Library` : 'Hardcopy currently unavailable at SATI Library'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    {selectedBook.genre || 'General'}
                  </span>
                  <h2 className="text-3xl font-bold mt-4 text-gray-900">{selectedBook.title}</h2>
                  <p className="text-lg text-gray-600">by {selectedBook.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">ISBN</p>
                    <p className="font-mono text-sm">{selectedBook.isbn || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Availability</p>
                    <p className={`text-sm font-semibold ${selectedBook.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedBook.available_quantity > 0
                        ? `${selectedBook.available_quantity} hardcopies at SATI Library`
                        : 'No hardcopy available right now'}
                    </p>
                  </div>
                </div>

                <section className="bg-amber-50 border border-amber-100 p-5 rounded-2xl mb-6">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <MessageSquareText size={18} /> SATI Library availability
                  </h4>
                  <p className="text-amber-900/90 text-sm leading-relaxed">
                    {selectedBook.available_quantity > 0
                      ? 'Hardcopy is available in the SATI Library for in-person reading or borrowing.'
                      : 'Hardcopy is currently not available in the SATI Library. Check again later.'}
                  </p>
                </section>

                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleRequestIssue}
                    disabled={requestingBookId === selectedBook.id || requestedBookIds.includes(selectedBook.id)}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {requestedBookIds.includes(selectedBook.id)
                      ? 'Request Sent'
                      : requestingBookId === selectedBook.id
                        ? 'Sending Request...'
                        : 'Request Issue'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Send a request from here. Admin only needs to accept it, then this book will be issued.
                  </p>
                </div>

                <section>
                  <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedBook.description}</p>
                </section>
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
                    placeholder="Write a comment or review about this book..."
                    className="w-full min-h-28 p-3 border rounded-xl resize-y"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Add Comment
                  </button>
                </form>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {loadingComments ? (
                    <p className="text-sm text-gray-500">Loading comments...</p>
                  ) : bookComments.length === 0 ? (
                    <p className="text-sm text-gray-500">No comments yet. Be the first to review.</p>
                  ) : (
                    bookComments.map((comment) => (
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

export default BookCatalog;
