import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthPage } from './AuthPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <>{children}</>;
};