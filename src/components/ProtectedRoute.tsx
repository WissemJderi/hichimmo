import { Navigate } from 'react-router';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('webtoken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};