import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userTypes?: ('user' | 'ngo')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  userTypes 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If userTypes is specified, check if user has the required type
  if (userTypes && user && !userTypes.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    if (user.userType === 'ngo') {
      return <Navigate to="/ngo-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has the required type (if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
