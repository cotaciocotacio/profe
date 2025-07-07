import type { LoginCredentials, RegisterData, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Datos mockeados para desarrollo
const mockUsers = {
  admin: {
    id: '1',
    email: 'admin@escuela.edu',
    name: 'Administrador del Sistema',
    role: 'admin' as const,
    organizationId: 'org-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  teacher: {
    id: '2',
    email: 'teacher@escuela.edu',
    name: 'Profesor María González',
    role: 'teacher' as const,
    organizationId: 'org-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

class AuthService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error de conexión' }));
      throw new Error(error.message || 'Error en la solicitud');
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular autenticación basada en email
    let user: User;
    
    if (credentials.email === 'admin@escuela.edu') {
      user = mockUsers.admin;
    } else if (credentials.email === 'teacher@escuela.edu') {
      user = mockUsers.teacher;
    } else {
      throw new Error('Credenciales inválidas');
    }
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    return { user, token };
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      organizationId: data.organizationId || 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const token = `mock-token-${user.id}-${Date.now()}`;
    
    return { user, token };
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { message: 'Se ha enviado un enlace de restablecimiento a tu email' };
  }

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Simular obtención de usuario basado en token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En un caso real, el token contendría información del usuario
    // Para desarrollo, simulamos basado en el token
    if (token.includes('admin')) {
      return mockUsers.admin;
    } else if (token.includes('teacher')) {
      return mockUsers.teacher;
    } else {
      throw new Error('Token inválido');
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Simular refresh de token
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { token: `refreshed-${token}` };
  }
}

export const authService = new AuthService(); 