import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden mr-3 p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100"
          aria-label="Open dashboard menu"
        >
          <Menu size={18} />
        </button>
        <img src="/SATI_Vidisha.jpg" alt="logo" className="w-10 h-10 mr-3" />
        <span className="text-lg hidden md:block sm:text-xl font-bold text-gray-800">SATI Library</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/dashboard/account"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          aria-label="Open account"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 sm:bg-transparent sm:border-0">
            <UserIcon size={20} />
          </span>
          <span className="hidden sm:inline font-medium">{user?.name} ({user?.role})</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
