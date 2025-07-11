import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthContextType, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isTransitioning: false,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: any } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_TRANSITION' }
  | { type: 'END_TRANSITION' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true,
      };
    case 'END_TRANSITION':
      return {
        ...state,
        isTransitioning: false,
      };
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
        // No simular usuario automáticamente - permitir flujo normal de login
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const { user, token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      
      // Iniciar transición suave
      dispatch({ type: 'START_TRANSITION' });
      
      // Simular delay para la animación
      setTimeout(() => {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
        dispatch({ type: 'END_TRANSITION' });
      }, 800);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: (error as Error).message });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const { user, token } = await authService.register(data);
      localStorage.setItem('token', token);
      
      // Iniciar transición suave
      dispatch({ type: 'START_TRANSITION' });
      
      // Simular delay para la animación
      setTimeout(() => {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
        dispatch({ type: 'END_TRANSITION' });
      }, 800);
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
      await authService.resetPassword(email);
    } catch (error) {
      throw error;
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 