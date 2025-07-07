import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = (redirectTo: string, whenAuthenticated: boolean = true) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated === whenAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo, whenAuthenticated]);

  return { isAuthenticated, isLoading };
}; 