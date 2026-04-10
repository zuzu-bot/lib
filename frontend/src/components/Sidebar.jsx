import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Book,
  Users,
  BookOpen,
  FileText,
  UserCircle,
  ClipboardList,
  PlusCircle
} from 'lucide-react';

const Sidebar = ({ role, mobileOpen = false, onClose }) => {
  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Books Management', path: '/admin/books', icon: <Book size={20} /> },
    { name: 'User Management', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Issue/Return', path: '/admin/transactions', icon: <ClipboardList size={20} /> },
    { name: 'Fine Reports', path: '/admin/reports', icon: <FileText size={20} /> },
    { name: 'Upload Notes/PYQ', path: '/admin/uploads', icon: <PlusCircle size={20} /> },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Browse Books', path: '/dashboard/books', icon: <BookOpen size={20} /> },
    { name: 'Issued Books', path: '/dashboard/issued-books', icon: <ClipboardList size={20} /> },
    { name: 'Notes & PYQs', path: '/dashboard/notes', icon: <FileText size={20} /> },
    { name: 'Upload Notes/PYQ', path: '/dashboard/uploads', icon: <PlusCircle size={20} /> },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  const navList = (closeOnClick = false) => (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            onClick={closeOnClick ? onClose : undefined}
            end={link.path === '/admin' || link.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition-colors border ${isActive
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside className="hidden md:block w-64 bg-white text-gray-800 h-screen fixed left-0 top-14 overflow-y-auto border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Navigation</p>
          </div>
          {navList(false)}
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70]">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close menu" />
          <aside className="absolute left-0 top-14 bottom-0 w-72 bg-white text-gray-800 overflow-y-auto border-r border-gray-200 shadow-xl">
            <div className="p-6">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Navigation</p>
              </div>
              {navList(true)}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
