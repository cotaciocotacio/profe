import type { 
  PlanGenerationJob, 
  PlanGenerationFormData, 
  PlanFile,
  Subject,
  Course 
} from '../types/plans';

// Datos simulados para desarrollo
const mockSubjects: Subject[] = [
  { id: '1', name: 'Matemáticas', code: 'MATH' },
  { id: '2', name: 'Física', code: 'PHYS' },
  { id: '3', name: 'Química', code: 'CHEM' },
  { id: '4', name: 'Historia', code: 'HIST' },
  { id: '5', name: 'Geografía', code: 'GEO' },
  { id: '6', name: 'Lengua', code: 'LANG' },
  { id: '7', name: 'Literatura', code: 'LIT' },
  { id: '8', name: 'Biología', code: 'BIO' },
];

const mockCourses: Course[] = [
  { id: '1', name: 'Primer Grado', grade: '1°' },
  { id: '2', name: 'Segundo Grado', grade: '2°' },
  { id: '3', name: 'Tercer Grado', grade: '3°' },
  { id: '4', name: 'Cuarto Grado', grade: '4°' },
  { id: '5', name: 'Quinto Grado', grade: '5°' },
  { id: '6', name: 'Sexto Grado', grade: '6°' },
];

class PlansService {
  async getSubjects(): Promise<Subject[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSubjects;
  }

  async getCourses(): Promise<Course[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses;
  }

  async uploadFiles(files: File[]): Promise<PlanFile[]> {
    // Simular upload de archivos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return files.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));
  }

  async generatePlan(data: PlanGenerationFormData): Promise<PlanGenerationJob> {
    // Simular generación de plan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const uploadedFiles = await this.uploadFiles(data.files);
    
    return {
      id: `job-${Date.now()}`,
      teacherId: 'teacher-1', // En producción vendría del contexto de auth
      subjectId: data.subjectId,
      courseId: data.courseId,
      status: 'processing',
      files: uploadedFiles,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getJobStatus(jobId: string): Promise<PlanGenerationJob> {
    // Simular consulta de estado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular diferentes estados
    const random = Math.random();
    let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
    
    if (random > 0.7) {
      status = 'completed';
    } else if (random > 0.5) {
      status = 'failed';
    }
    
    return {
      id: jobId,
      teacherId: 'teacher-1',
      subjectId: '1',
      courseId: '1',
      status,
      files: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(status === 'completed' && {
        completedAt: new Date(),
        result: {
          id: `result-${jobId}`,
          planId: jobId,
          summary: 'Plan de reforzamiento generado exitosamente basado en los resultados del examen.',
          recommendations: [
            'Enfócate en los conceptos de álgebra básica',
            'Practica más ejercicios de geometría',
            'Revisa los fundamentos de trigonometría'
          ],
          exercises: [
            {
              id: 'ex-1',
              title: 'Ecuaciones lineales',
              description: 'Resuelve las siguientes ecuaciones lineales',
              difficulty: 'medium',
              type: 'problem_solving',
              content: '2x + 5 = 13',
              solution: 'x = 4'
            },
            {
              id: 'ex-2',
              title: 'Área de figuras geométricas',
              description: 'Calcula el área de las siguientes figuras',
              difficulty: 'easy',
              type: 'problem_solving',
              content: 'Un rectángulo de 8cm x 6cm',
              solution: '48 cm²'
            }
          ],
          createdAt: new Date()
        }
      })
    };
  }

  async getTeacherJobs(teacherId: string): Promise<PlanGenerationJob[]> {
    // Simular jobs existentes
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'job-1',
        teacherId,
        subjectId: '1',
        courseId: '2',
        status: 'completed',
        files: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15'),
        result: {
          id: 'result-1',
          planId: 'job-1',
          summary: 'Plan de matemáticas para segundo grado',
          recommendations: ['Practicar más álgebra'],
          exercises: [],
          createdAt: new Date('2024-01-15')
        }
      },
      {
        id: 'job-2',
        teacherId,
        subjectId: '2',
        courseId: '3',
        status: 'processing',
        files: [],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      }
    ];
  }
}

export const plansService = new PlansService(); 