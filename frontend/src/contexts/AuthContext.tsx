import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthContextType, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: any } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const user = await authService.getCurrentUser();
          dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE', payload: 'Sesión expirada' });
        }
      } else {
        // Simular usuario admin para desarrollo
        const mockUser = {
          id: '1',
          email: 'admin@test.com',
          name: 'Administrador',
          role: 'admin' as const,
          organizationId: 'org-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser } });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Simular login exitoso para desarrollo
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: 'Administrador',
        role: 'admin' as const,
        organizationId: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-token-123';
      localStorage.setItem('token', mockToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser } });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: (error as Error).message });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Simular registro exitoso para desarrollo
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        role: data.role,
        organizationId: data.organizationId || 'org-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const mockToken = 'mock-token-123';
      localStorage.setItem('token', mockToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser } });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: (error as Error).message });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const resetPassword = async (email: string) => {
    try {
      // Simular reset de contraseña
      console.log('Reset password for:', email);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: (error as Error).message });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 