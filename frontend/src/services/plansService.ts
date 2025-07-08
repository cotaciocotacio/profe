import type { 
  PlanGenerationJob, 
  PlanGenerationFormData, 
  PlanFile,
  Subject,
  Course,
  PlanResults
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
      },
      {
        id: 'job-3',
        teacherId,
        subjectId: '3',
        courseId: '4',
        status: 'completed',
        files: [],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-10'),
        result: {
          id: 'result-3',
          planId: 'job-3',
          summary: 'Plan de química para cuarto grado',
          recommendations: ['Revisar tabla periódica', 'Practicar balanceo de ecuaciones'],
          exercises: [],
          createdAt: new Date('2024-01-10')
        }
      },
      {
        id: 'job-4',
        teacherId,
        subjectId: '4',
        courseId: '5',
        status: 'processing',
        files: [],
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
      },
      {
        id: 'job-5',
        teacherId,
        subjectId: '6',
        courseId: '1',
        status: 'completed',
        files: [],
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
        completedAt: new Date('2024-01-08'),
        result: {
          id: 'result-5',
          planId: 'job-5',
          summary: 'Plan de lengua para primer grado',
          recommendations: ['Mejorar comprensión lectora', 'Practicar ortografía'],
          exercises: [],
          createdAt: new Date('2024-01-08')
        }
      }
    ];
  }

  async getPlanResults(planId: string): Promise<PlanResults> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      planId,
      planName: 'Plan de Reforzamiento - Matemáticas',
      subjectName: 'Matemáticas',
      courseName: 'Segundo Grado',
      totalStudents: 25,
      completedStudents: 18,
      averageScore: 78,
      students: [
        {
          id: '1',
          studentId: 'student-1',
          studentName: 'Ana García',
          planId,
          status: 'completed',
          score: 85,
          completedAt: new Date('2024-01-20'),
          planContent: `# Plan de Reforzamiento - Ana García

## Resumen del Plan
Este plan está diseñado para fortalecer los conceptos de álgebra básica y geometría.

## Objetivos
- Mejorar la comprensión de ecuaciones lineales
- Fortalecer el cálculo de áreas y perímetros
- Practicar resolución de problemas

## Actividades Recomendadas
1. Ejercicios de ecuaciones lineales
2. Problemas de geometría
3. Práctica de resolución de problemas`,
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
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: '2',
          studentId: 'student-2',
          studentName: 'Carlos Rodríguez',
          planId,
          status: 'in_progress',
          score: 65,
          completedAt: undefined,
          planContent: `# Plan de Reforzamiento - Carlos Rodríguez

## Resumen del Plan
Plan enfocado en mejorar la comprensión de conceptos matemáticos básicos.

## Objetivos
- Reforzar operaciones básicas
- Mejorar la resolución de problemas
- Practicar geometría básica`,
          recommendations: [
            'Necesita más práctica en operaciones básicas',
            'Enfócate en la resolución de problemas paso a paso'
          ],
          exercises: [
            {
              id: 'ex-3',
              title: 'Operaciones básicas',
              description: 'Realiza las siguientes operaciones',
              difficulty: 'easy',
              type: 'problem_solving',
              content: '15 + 23 - 8 × 2',
              solution: '22'
            }
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-18')
        },
        {
          id: '3',
          studentId: 'student-3',
          studentName: 'María López',
          planId,
          status: 'not_started',
          score: undefined,
          completedAt: undefined,
          planContent: `# Plan de Reforzamiento - María López

## Resumen del Plan
Plan personalizado para mejorar el rendimiento en matemáticas.

## Objetivos
- Desarrollar habilidades de pensamiento lógico
- Mejorar la comprensión de conceptos abstractos
- Practicar resolución de problemas complejos`,
          recommendations: [
            'Comienza con ejercicios básicos',
            'Practica regularmente',
            'Busca ayuda cuando sea necesario'
          ],
          exercises: [],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }
      ],
      createdAt: new Date('2024-01-15')
    };
  }

  async downloadAllPlans(planId: string): Promise<void> {
    // Simular descarga de ZIP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // En un caso real, aquí se generaría y descargaría el ZIP
    console.log(`Descargando todos los planes del plan ${planId}`);
  }
}

export const plansService = new PlansService(); 