export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationId: string;
  subjects: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export interface SubjectFormData {
  name: string;
}

export interface CourseFormData {
  name: string;
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subjects: string[];
}

export interface AdminDashboardState {
  organization: Organization | null;
  subjects: Subject[];
  courses: Course[];
  teachers: Teacher[];
  isLoading: boolean;
  error: string | null;
} 