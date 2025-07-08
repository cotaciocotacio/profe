export interface PlanGenerationJob {
  id: string;
  teacherId: string;
  subjectId: string;
  courseId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  files: PlanFile[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  result?: PlanResult;
}

export interface PlanFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
}

export interface PlanResult {
  id: string;
  planId: string;
  summary: string;
  recommendations: string[];
  exercises: Exercise[];
  createdAt: Date;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple_choice' | 'open_ended' | 'problem_solving';
  content: string;
  solution?: string;
}

export interface PlanGenerationFormData {
  subjectId: string;
  courseId: string;
  files: File[];
}

export interface PlanGenerationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
}

export interface Course {
  id: string;
  name: string;
  grade: string;
}

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  planId: string;
  status: 'completed' | 'in_progress' | 'not_started';
  score?: number;
  completedAt?: Date;
  planContent: string; // Markdown content
  recommendations: string[];
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanResults {
  planId: string;
  planName: string;
  subjectName: string;
  courseName: string;
  totalStudents: number;
  completedStudents: number;
  averageScore?: number;
  students: StudentResult[];
  createdAt: Date;
}

export interface PlanModalData {
  studentName: string;
  planContent: string;
  recommendations: string[];
  exercises: Exercise[];
} 