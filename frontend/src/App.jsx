import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BookManagement from './pages/admin/BookManagement';
import UserManagement from './pages/admin/UserManagement';
import TransactionManagement from './pages/admin/TransactionManagement';
import FileManagement from './pages/admin/FileManagement';
import FineReports from './pages/admin/FineReports';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import BookCatalog from './pages/student/BookCatalog';
import MyAccount from './pages/student/MyAccount';
import MyRequests from './pages/student/MyRequests';
import Downloads from './pages/student/Downloads';
import UploadNotes from './pages/student/UploadNotes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/books" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><BookManagement /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><UserManagement /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/transactions" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><TransactionManagement /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/uploads" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><FileManagement /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute role="admin">
            <Layout role="admin"><FineReports /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute role="student">
            <Layout role="student"><StudentDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/books" element={
          <ProtectedRoute role="student">
            <Layout role="student"><BookCatalog /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/requests" element={
          <ProtectedRoute role="student">
            <Layout role="student"><MyRequests /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/issued-books" element={
          <ProtectedRoute role="student">
            <Layout role="student"><MyRequests /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/downloads" element={
          <ProtectedRoute role="student">
            <Layout role="student"><Downloads /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/notes" element={
          <ProtectedRoute role="student">
            <Layout role="student"><Downloads /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/uploads" element={
          <ProtectedRoute role="student">
            <Layout role="student"><UploadNotes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute role="student">
            <Layout role="student"><MyAccount /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/account" element={
          <ProtectedRoute role="student">
            <Layout role="student"><MyAccount /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
