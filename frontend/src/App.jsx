import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Production Pages
import IdeaFeed from './pages/IdeaFeed';
import IdeaDetail from './pages/IdeaDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateIdea from './pages/CreateIdea';
import Dashboard from './pages/Dashboard';
import UserInsights from './pages/UserInsights';

// Placeholder Pages (To be built in Step 13)
const Admin = () => (
  <div className="min-h-screen bg-aurora-dark text-slate-100 pb-20">
    <Navbar />
    <div className="p-8"><h1>Admin Panel - Step 13</h1></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-aurora-dark">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<IdeaFeed />} />

            {/* User Routes */}
            <Route 
              path="/ideas/:id" 
              element={<IdeaDetail />} 
            />

            {/* Founder Routes */}
            <Route 
              path="/post-idea" 
              element={
                <ProtectedRoute roles={['founder', 'admin']}>
                  <CreateIdea />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute roles={['founder', 'admin', 'user']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/insights" 
              element={
                <ProtectedRoute roles={['user', 'founder', 'admin']}>
                  <UserInsights />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
