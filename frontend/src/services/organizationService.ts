import type { 
  Organization, 
  Subject, 
  Course, 
  Teacher,
  OrganizationFormData,
  SubjectFormData,
  CourseFormData,
  TeacherFormData
} from '../types/organization';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class OrganizationService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
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

  // Organization CRUD
  async getOrganization(): Promise<Organization> {
    return this.request('/admin/organization');
  }

  async updateOrganization(data: OrganizationFormData): Promise<Organization> {
    return this.request('/admin/organization', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Subjects CRUD
  async getSubjects(): Promise<Subject[]> {
    return this.request('/admin/subjects');
  }

  async createSubject(data: SubjectFormData): Promise<Subject> {
    return this.request('/admin/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubject(id: string, data: SubjectFormData): Promise<Subject> {
    return this.request(`/admin/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSubject(id: string): Promise<void> {
    return this.request(`/admin/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  // Courses CRUD
  async getCourses(): Promise<Course[]> {
    return this.request('/admin/courses');
  }

  async createCourse(data: CourseFormData): Promise<Course> {
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string, data: CourseFormData): Promise<Course> {
    return this.request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string): Promise<void> {
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Teachers CRUD
  async getTeachers(): Promise<Teacher[]> {
    return this.request('/admin/teachers');
  }

  async createTeacher(data: TeacherFormData): Promise<Teacher> {
    return this.request('/admin/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeacher(id: string, data: Partial<TeacherFormData>): Promise<Teacher> {
    return this.request(`/admin/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeacher(id: string): Promise<void> {
    return this.request(`/admin/teachers/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTeacherStatus(id: string, isActive: boolean): Promise<Teacher> {
    return this.request(`/admin/teachers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }
}

export const organizationService = new OrganizationService(); 