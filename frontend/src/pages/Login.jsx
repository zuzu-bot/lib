import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { isGoogleAuthEnabled } from '../config/googleAuth';

const Login = () => {
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get('role');
  const initialRole = roleFromQuery === 'admin' ? 'admin' : 'student';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (response) => {
    const loggedInRole = response.data.user.role;

    if (selectedRole !== loggedInRole) {
      setError(`This account is ${loggedInRole}. Please use the ${loggedInRole} login option.`);
      return;
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    if (loggedInRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/auth/login', { email, password });
      handleLoginSuccess(response);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google', { tokenId: credentialResponse.credential });
      handleLoginSuccess(response);
    } catch (err) {
      setError('Google Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">Login to SATI Library</h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don&apos;t have credentials?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Register / Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg border border-slate-200 sm:rounded-xl sm:px-10">
          <div className="mb-6 bg-slate-100 rounded-lg p-1 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2 rounded-md text-sm font-semibold transition-colors ${selectedRole === 'student' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Student Login
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 rounded-md text-sm font-semibold transition-colors ${selectedRole === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Admin Login
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-md">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" id="password-label" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue as {selectedRole === 'admin' ? 'Admin' : 'Student'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {isGoogleAuthEnabled ? (
              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  theme="filled_blue"
                  shape="pill"
                />
              </div>
            ) : (
              <p className="mt-4 text-center text-xs text-gray-500">
                Google login is disabled until VITE_GOOGLE_CLIENT_ID is configured.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
