# 🗄️ ERD - Diseño de Base de Datos Compartida

## 📋 Descripción General

Este documento define el **Entity Relationship Diagram (ERD)** para la base de datos PostgreSQL compartida que será utilizada por todos los microservicios de la plataforma Profe. La arquitectura sigue el patrón de **Database per Service** pero con una base de datos compartida para facilitar las relaciones entre entidades.

---

## 🏗️ **ARQUITECTURA DE BASE DE DATOS**

### **Estrategia: Base de Datos Compartida**
- **Una sola base de datos PostgreSQL** para todos los microservicios
- **Separación por esquemas** para organizar las tablas por dominio
- **Relaciones directas** entre entidades de diferentes servicios
- **Migraciones centralizadas** a través del Database Migration Service

### **Esquemas de Base de Datos**
```
profe_database/
├── public/              # Tablas compartidas y configuración
├── auth/                # Autenticación y autorización
├── users/               # Gestión de usuarios y perfiles
├── organizations/       # Organizaciones y configuración
├── academic/            # Materias, cursos y contenido académico
├── plans/               # Planes de refuerzo y resultados
├── chat/                # Sesiones de chat y mensajes
├── analytics/           # Métricas y reportes
└── files/               # Gestión de archivos y metadata
```

---

## 📊 **ENTIDADES PRINCIPALES**

---

### **🔐 ESQUEMA: AUTH**

#### **1. users**
```sql
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **2. sessions**
```sql
CREATE TABLE auth.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

#### **3. password_resets**
```sql
CREATE TABLE auth.password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **👥 ESQUEMA: USERS**

#### **4. user_profiles**
```sql
CREATE TABLE users.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **5. user_roles**
```sql
CREATE TABLE users.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'admin', 'teacher', 'student', 'parent'
    organization_id UUID REFERENCES organizations.organizations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **6. user_preferences**
```sql
CREATE TABLE users.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'es',
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    notification_settings JSONB DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **🏫 ESQUEMA: ORGANIZATIONS**

#### **7. organizations**
```sql
CREATE TABLE organizations.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **8. organization_configs**
```sql
CREATE TABLE organizations.organization_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations.organizations(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, config_key)
);
```

---

### **📚 ESQUEMA: ACADEMIC**

#### **9. subjects**
```sql
CREATE TABLE academic.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    grade_level VARCHAR(20), -- 'elementary', 'middle', 'high'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **10. courses**
```sql
CREATE TABLE academic.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    grade_level VARCHAR(20),
    academic_year VARCHAR(10),
    organization_id UUID REFERENCES organizations.organizations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **11. course_subjects**
```sql
CREATE TABLE academic.course_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES academic.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, subject_id)
);
```

#### **12. teacher_courses**
```sql
CREATE TABLE academic.teacher_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, course_id)
);
```

---

### **📋 ESQUEMA: PLANS**

#### **13. plans**
```sql
CREATE TABLE plans.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES academic.subjects(id),
    course_id UUID REFERENCES academic.courses(id),
    organization_id UUID NOT NULL REFERENCES organizations.organizations(id),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'archived'
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    estimated_duration INTEGER, -- in days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **14. plan_jobs**
```sql
CREATE TABLE plans.plan_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plans.plans(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    progress INTEGER DEFAULT 0, -- 0-100
    result_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **15. plan_results**
```sql
CREATE TABLE plans.plan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans.plans(id) ON DELETE CASCADE,
    student_id UUID REFERENCES auth.users(id),
    score DECIMAL(5,2),
    completion_percentage INTEGER DEFAULT 0,
    time_spent INTEGER, -- in minutes
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **16. plan_files**
```sql
CREATE TABLE plans.plan_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans.plans(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files.files(id) ON DELETE CASCADE,
    file_type VARCHAR(50), -- 'input', 'output', 'template'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **💬 ESQUEMA: CHAT**

#### **17. chat_sessions**
```sql
CREATE TABLE chat.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    app_name VARCHAR(100) DEFAULT 'speaker',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'archived'
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **18. chat_messages**
```sql
CREATE TABLE chat.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat.chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    message_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **19. chat_files**
```sql
CREATE TABLE chat.chat_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat.chat_sessions(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files.files(id) ON DELETE CASCADE,
    message_id UUID REFERENCES chat.chat_messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **📊 ESQUEMA: ANALYTICS**

#### **20. user_metrics**
```sql
CREATE TABLE analytics.user_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'login_count', 'session_duration', 'activity_score'
    metric_value DECIMAL(10,2) NOT NULL,
    metric_data JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **21. plan_metrics**
```sql
CREATE TABLE analytics.plan_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES plans.plans(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'completion_rate', 'average_score', 'time_spent'
    metric_value DECIMAL(10,2) NOT NULL,
    metric_data JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **22. academic_metrics**
```sql
CREATE TABLE analytics.academic_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES academic.subjects(id),
    course_id UUID REFERENCES academic.courses(id),
    organization_id UUID REFERENCES organizations.organizations(id),
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_data JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### **📁 ESQUEMA: FILES**

#### **23. files**
```sql
CREATE TABLE files.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64),
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    organization_id UUID REFERENCES organizations.organizations(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **24. file_metadata**
```sql
CREATE TABLE files.file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files.files(id) ON DELETE CASCADE,
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(file_id, metadata_key)
);
```

#### **25. file_permissions**
```sql
CREATE TABLE files.file_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files.files(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    role VARCHAR(50) REFERENCES users.user_roles(role),
    permission_type VARCHAR(20) NOT NULL, -- 'read', 'write', 'delete'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(file_id, user_id, permission_type)
);
```

---

## 🔗 **RELACIONES PRINCIPALES**

### **Relaciones de Usuario**
```
auth.users (1) ←→ (1) users.user_profiles
auth.users (1) ←→ (N) users.user_roles
auth.users (1) ←→ (1) users.user_preferences
auth.users (1) ←→ (N) auth.sessions
auth.users (1) ←→ (N) auth.password_resets
```

### **Relaciones Organizacionales**
```
organizations.organizations (1) ←→ (N) users.user_roles
organizations.organizations (1) ←→ (N) organizations.organization_configs
organizations.organizations (1) ←→ (N) academic.courses
organizations.organizations (1) ←→ (N) plans.plans
organizations.organizations (1) ←→ (N) files.files
```

### **Relaciones Académicas**
```
academic.subjects (1) ←→ (N) plans.plans
academic.courses (1) ←→ (N) academic.course_subjects
academic.subjects (1) ←→ (N) academic.course_subjects
academic.courses (1) ←→ (N) academic.teacher_courses
auth.users (1) ←→ (N) academic.teacher_courses
```

### **Relaciones de Planes**
```
plans.plans (1) ←→ (N) plans.plan_jobs
plans.plans (1) ←→ (N) plans.plan_results
plans.plans (1) ←→ (N) plans.plan_files
plans.plans (1) ←→ (N) analytics.plan_metrics
auth.users (1) ←→ (N) plans.plans (teacher)
auth.users (1) ←→ (N) plans.plan_results (student)
```

### **Relaciones de Chat**
```
chat.chat_sessions (1) ←→ (N) chat.chat_messages
chat.chat_sessions (1) ←→ (N) chat.chat_files
auth.users (1) ←→ (N) chat.chat_sessions
```

### **Relaciones de Archivos**
```
files.files (1) ←→ (N) files.file_metadata
files.files (1) ←→ (N) files.file_permissions
files.files (1) ←→ (N) plans.plan_files
files.files (1) ←→ (N) chat.chat_files
```

---

## 📈 **ÍNDICES RECOMENDADOS**

### **Índices de Rendimiento**
```sql
-- Auth
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_token ON auth.sessions(token);

-- Users
CREATE INDEX idx_user_profiles_user_id ON users.user_profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON users.user_roles(user_id);
CREATE INDEX idx_user_roles_organization ON users.user_roles(organization_id);

-- Organizations
CREATE INDEX idx_organization_configs_org_id ON organizations.organization_configs(organization_id);

-- Academic
CREATE INDEX idx_course_subjects_course_id ON academic.course_subjects(course_id);
CREATE INDEX idx_course_subjects_subject_id ON academic.course_subjects(subject_id);
CREATE INDEX idx_teacher_courses_teacher_id ON academic.teacher_courses(teacher_id);

-- Plans
CREATE INDEX idx_plans_teacher_id ON plans.plans(teacher_id);
CREATE INDEX idx_plans_organization_id ON plans.plans(organization_id);
CREATE INDEX idx_plan_jobs_teacher_id ON plans.plan_jobs(teacher_id);
CREATE INDEX idx_plan_results_plan_id ON plans.plan_results(plan_id);

-- Chat
CREATE INDEX idx_chat_sessions_user_id ON chat.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat.chat_messages(session_id);

-- Analytics
CREATE INDEX idx_user_metrics_user_id ON analytics.user_metrics(user_id);
CREATE INDEX idx_plan_metrics_plan_id ON analytics.plan_metrics(plan_id);
CREATE INDEX idx_analytics_recorded_at ON analytics.user_metrics(recorded_at);

-- Files
CREATE INDEX idx_files_uploaded_by ON files.files(uploaded_by);
CREATE INDEX idx_files_organization_id ON files.files(organization_id);
```

---

## 🔒 **POLÍTICAS DE SEGURIDAD**

### **Row Level Security (RLS)**
```sql
-- Habilitar RLS en tablas sensibles
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files.files ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
CREATE POLICY "Users can view own profile" ON users.user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view own plans" ON plans.plans
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Users can view own chat sessions" ON chat.chat_sessions
    FOR ALL USING (auth.uid() = user_id);
```

---

## 📊 **ESTADÍSTICAS DE LA BASE DE DATOS**

### **Resumen de Entidades**
- **Total de Tablas**: 25 tablas
- **Total de Esquemas**: 8 esquemas
- **Relaciones Principales**: 15+ relaciones
- **Índices Recomendados**: 20+ índices

### **Distribución por Esquema**
- **auth**: 3 tablas (usuarios, sesiones, reset passwords)
- **users**: 3 tablas (perfiles, roles, preferencias)
- **organizations**: 2 tablas (organizaciones, configuraciones)
- **academic**: 4 tablas (materias, cursos, relaciones)
- **plans**: 4 tablas (planes, jobs, resultados, archivos)
- **chat**: 3 tablas (sesiones, mensajes, archivos)
- **analytics**: 3 tablas (métricas por dominio)
- **files**: 3 tablas (archivos, metadata, permisos)

---

## 🚀 **PRÓXIMOS PASOS**

1. **Crear migraciones Alembic** para cada esquema
2. **Implementar seed data** para datos iniciales
3. **Configurar políticas de seguridad** RLS
4. **Crear vistas materializadas** para reportes complejos
5. **Implementar triggers** para auditoría y logs
6. **Configurar backups automáticos** y retención

---

Este ERD proporciona una base sólida para la arquitectura de microservicios con base de datos compartida, manteniendo la separación de responsabilidades a través de esquemas mientras permite relaciones directas entre entidades. 