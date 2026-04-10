import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Clock, Book, IndianRupee, User, Lock, FileText } from 'lucide-react';
import { resolveFileUrl } from '../../utils/fileUrl';

const MyAccount = () => {
  const [history, setHistory] = useState([]);
  const [myUploads, setMyUploads] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    enrollment_no: '',
    branch: '',
    semester: '',
    batch_year: '',
  });
  const [loading, setLoading] = useState(true);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchHistory();
    fetchMyUploads();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/student/profile');
      const profileData = {
        name: response.data.name || '',
        email: response.data.email || '',
        enrollment_no: response.data.enrollment_no || '',
        branch: response.data.branch || '',
        semester: response.data.semester || '',
        batch_year: response.data.batch_year ? String(response.data.batch_year) : '',
      };
      setProfile(profileData);
      localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile({
        name: user.name || '',
        email: user.email || '',
        enrollment_no: user.enrollment_no || '',
        branch: user.branch || '',
        semester: user.semester || '',
        batch_year: user.batch_year ? String(user.batch_year) : '',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/student/history');
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  const fetchMyUploads = async () => {
    try {
      const response = await api.get('/api/files/my-uploads');
      setMyUploads(response.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setMyUploads([]);
    } finally {
      setUploadsLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  const activeBooks = history.filter(b => b.status === 'issued');
  const totalFines = history.reduce((acc, curr) => acc + (curr.fine_amount || 0), 0);

  const currentYear = new Date().getFullYear();
  const batchYearOptions = Array.from({ length: 12 }, (_, index) => currentYear + 4 - index);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        enrollment_no: profile.enrollment_no.trim(),
        branch: profile.branch.trim(),
        semester: profile.semester.trim(),
        batch_year: profile.batch_year ? Number(profile.batch_year) : null,
      };
      const response = await api.put('/api/student/profile', payload);
      const updatedProfile = {
        name: response.data.name || '',
        email: response.data.email || '',
        enrollment_no: response.data.enrollment_no || '',
        branch: response.data.branch || '',
        semester: response.data.semester || '',
        batch_year: response.data.batch_year ? String(response.data.batch_year) : '',
      };
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await api.post('/api/student/change-password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-blue-600 p-3 rounded-full text-white">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name || user.name || 'Student'}</h1>
          <p className="text-gray-600">{profile.email || user.email || '-'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Profile Details</h2>
            <p className="text-sm text-gray-500">Update your basic academic profile.</p>
          </div>
        </div>

        {profileLoading ? (
          <p className="text-sm text-gray-500">Loading profile...</p>
        ) : (
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              type="email"
              className="w-full p-3 border rounded-lg"
              placeholder="Email"
              value={profile.email}
              onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Enrollment No."
              value={profile.enrollment_no}
              onChange={(e) => setProfile((prev) => ({ ...prev, enrollment_no: e.target.value }))}
            />
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Branch"
              value={profile.branch}
              onChange={(e) => setProfile((prev) => ({ ...prev, branch: e.target.value }))}
            />
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Semester"
              value={profile.semester}
              onChange={(e) => setProfile((prev) => ({ ...prev, semester: e.target.value }))}
            />
            <select
              className="w-full p-3 border rounded-lg"
              value={profile.batch_year}
              onChange={(e) => setProfile((prev) => ({ ...prev, batch_year: e.target.value }))}
            >
              <option value="">Select Batch Year</option>
              {batchYearOptions.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <Book size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Currently Issued</p>
            <p className="text-xl font-bold">{activeBooks.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Borrowed</p>
            <p className="text-xl font-bold">{history.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-600">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Fines</p>
            <p className="text-xl font-bold">₹{Number(totalFines || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="space-y-4 md:hidden">
        {history.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.author}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'issued' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                {item.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div>
                <p className="text-gray-400 text-xs uppercase">Issue</p>
                <p>{new Date(item.issue_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase">Due</p>
                <p>{new Date(item.due_date).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs uppercase">Return</p>
                <p>{item.return_date ? new Date(item.return_date).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
            No books issued yet.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Book</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Issue Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Due Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Return Date</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.issue_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.return_date ? new Date(item.return_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'issued' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No books issued yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">My Uploads</h2>
            <p className="text-sm text-gray-500">Your uploaded notes and PYQs.</p>
          </div>
        </div>

        <div className="space-y-3">
          {uploadsLoading ? (
            <p className="text-sm text-gray-500">Loading uploads...</p>
          ) : myUploads.length === 0 ? (
            <p className="text-sm text-gray-500">You have not uploaded any notes or PYQs yet.</p>
          ) : (
            myUploads.map((file) => (
              <div key={file.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {file.type?.toUpperCase()} · {file.subject || 'Subject N/A'} · {file.semester || 'Semester N/A'}
                  </p>
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
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-100 text-slate-700 p-2 rounded-lg">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Change Password</h2>
            <p className="text-sm text-gray-500">Update your account password from here.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          />
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          />
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {savingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyAccount;
