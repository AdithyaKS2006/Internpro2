import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import StudentDashboard from '@/pages/StudentDashboard';
import PlacementStaffDashboard from '@/pages/PlacementStaffDashboard';
import FacultyDashboard from '@/pages/FacultyDashboard';
import EmployerDashboard from '@/pages/EmployerDashboard';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const getDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} logout={logout} />;
      case 'placement_staff':
        return <PlacementStaffDashboard user={user} logout={logout} />;
      case 'faculty':
        return <FacultyDashboard user={user} logout={logout} />;
      case 'employer':
        return <EmployerDashboard user={user} logout={logout} />;
      default:
        return <Navigate to="/" />;
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? getDashboard() : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {getDashboard()}
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
