# 🗄️ ERD - Diagrama Visual de Relaciones

## 📊 **DIAGRAMA DE ENTIDADES Y RELACIONES**

### **🔐 ESQUEMA AUTH**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   auth.users    │    │ auth.sessions   │    │password_resets  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email (UQ)      │    │ user_id (FK)    │    │ user_id (FK)    │
│ password_hash   │    │ token           │    │ token           │
│ is_active       │    │ refresh_token   │    │ expires_at      │
│ is_verified     │    │ expires_at      │    │ used_at         │
│ created_at      │    │ is_active       │    │ created_at      │
│ updated_at      │    │ created_at      │    └─────────────────┘
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
```

### **👥 ESQUEMA USERS**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ user_profiles   │    │  user_roles     │    │user_preferences │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │    │ user_id (FK)    │    │ user_id (FK)    │
│ first_name      │    │ role            │    │ language        │
│ last_name       │    │ organization_id │    │ timezone        │
│ avatar_url      │    │ is_active       │    │ notification_s  │
│ phone           │    │ created_at      │    │ theme           │
│ date_of_birth   │    │ updated_at      │    │ created_at      │
│ gender          │    └─────────────────┘    │ updated_at      │
│ created_at      │            │              └─────────────────┘
│ updated_at      │            │
└─────────────────┘            │
         │                     │
         └─────────────────────┘
```

### **🏫 ESQUEMA ORGANIZATIONS**
```
┌─────────────────┐    ┌─────────────────┐
│ organizations   │    │org_configs      │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ name            │    │ organization_id │
│ description     │    │ config_key      │
│ logo_url        │    │ config_value    │
│ website         │    │ created_at      │
│ email           │    │ updated_at      │
│ phone           │    └─────────────────┘
│ address         │
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │
```

### **📚 ESQUEMA ACADEMIC**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    subjects     │    │    courses      │    │ course_subjects │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ name            │    │ name            │    │ course_id (FK)   │
│ code (UQ)       │    │ code (UQ)       │    │ subject_id (FK) │
│ description     │    │ description     │    │ created_at      │
│ grade_level     │    │ grade_level     │    └─────────────────┘
│ is_active       │    │ academic_year   │            │
│ created_at      │    │ organization_id │            │
│ updated_at      │    │ is_active       │            │
└─────────────────┘    │ created_at      │            │
         │             │ updated_at      │            │
         │             └─────────────────┘            │
         │                     │                      │
         └─────────────────────┼──────────────────────┘
                               │
                               │
                    ┌─────────────────┐
                    │ teacher_courses │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ teacher_id (FK) │
                    │ course_id (FK)  │
                    │ is_active       │
                    │ created_at      │
                    │ updated_at      │
                    └─────────────────┘
```

### **📋 ESQUEMA PLANS**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     plans       │    │   plan_jobs     │    │  plan_results   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ title           │    │ plan_id (FK)    │    │ plan_id (FK)    │
│ description     │    │ teacher_id (FK) │    │ student_id (FK) │
│ teacher_id (FK) │    │ status          │    │ score           │
│ subject_id (FK) │    │ progress        │    │ completion_pct  │
│ course_id (FK)  │    │ result_data     │    │ time_spent      │
│ organization_id │    │ error_message   │    │ feedback        │
│ status          │    │ started_at      │    │ completed_at    │
│ difficulty_level│    │ completed_at    │    │ created_at      │
│ estimated_dur   │    │ created_at      │    │ updated_at      │
│ created_at      │    │ updated_at      │    └─────────────────┘
│ updated_at      │    └─────────────────┘
└─────────────────┘
         │
         │
         │
┌─────────────────┐
│  plan_files     │
├─────────────────┤
│ id (PK)         │
│ plan_id (FK)    │
│ file_id (FK)    │
│ file_type       │
│ created_at      │
└─────────────────┘
```

### **💬 ESQUEMA CHAT**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ chat_sessions   │    │ chat_messages   │    │  chat_files     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │    │ session_id (FK) │    │ session_id (FK) │
│ session_id (UQ) │    │ role            │    │ file_id (FK)    │
│ app_name        │    │ content         │    │ message_id (FK) │
│ status          │    │ message_data    │    │ created_at      │
│ context_data    │    │ created_at      │    └─────────────────┘
│ created_at      │    └─────────────────┘
│ updated_at      │
└─────────────────┘
```

### **📊 ESQUEMA ANALYTICS**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  user_metrics   │    │  plan_metrics   │    │academic_metrics │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ user_id (FK)    │    │ plan_id (FK)    │    │ subject_id (FK) │
│ metric_type     │    │ metric_type     │    │ course_id (FK)  │
│ metric_value    │    │ metric_value    │    │ organization_id │
│ metric_data     │    │ metric_data     │    │ metric_type     │
│ recorded_at     │    │ recorded_at     │    │ metric_value    │
└─────────────────┘    └─────────────────┘    │ metric_data     │
                                              │ recorded_at     │
                                              └─────────────────┘
```

### **📁 ESQUEMA FILES**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     files       │    │ file_metadata   │    │file_permissions │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ filename        │    │ file_id (FK)    │    │ file_id (FK)    │
│ original_name   │    │ metadata_key    │    │ user_id (FK)    │
│ file_path       │    │ metadata_value  │    │ role (FK)       │
│ file_size       │    │ created_at      │    │ permission_type │
│ mime_type       │    └─────────────────┘    │ created_at      │
│ file_hash       │                           └─────────────────┘
│ uploaded_by (FK)│
│ organization_id │
│ is_public       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## 🔗 **RELACIONES CRUZADAS ENTRE ESQUEMAS**

### **Relaciones Principales**
```
auth.users (1) ←→ (1) users.user_profiles
auth.users (1) ←→ (N) users.user_roles
auth.users (1) ←→ (N) plans.plans (teacher)
auth.users (1) ←→ (N) plans.plan_results (student)
auth.users (1) ←→ (N) chat.chat_sessions
auth.users (1) ←→ (N) files.files (uploaded_by)

organizations.organizations (1) ←→ (N) users.user_roles
organizations.organizations (1) ←→ (N) academic.courses
organizations.organizations (1) ←→ (N) plans.plans
organizations.organizations (1) ←→ (N) files.files

academic.subjects (1) ←→ (N) plans.plans
academic.courses (1) ←→ (N) academic.course_subjects
academic.subjects (1) ←→ (N) academic.course_subjects
academic.courses (1) ←→ (N) academic.teacher_courses
auth.users (1) ←→ (N) academic.teacher_courses

plans.plans (1) ←→ (N) plans.plan_jobs
plans.plans (1) ←→ (N) plans.plan_results
plans.plans (1) ←→ (N) plans.plan_files
plans.plans (1) ←→ (N) analytics.plan_metrics

chat.chat_sessions (1) ←→ (N) chat.chat_messages
chat.chat_sessions (1) ←→ (N) chat.chat_files

files.files (1) ←→ (N) files.file_metadata
files.files (1) ←→ (N) files.file_permissions
files.files (1) ←→ (N) plans.plan_files
files.files (1) ←→ (N) chat.chat_files
```

---

## 📈 **FLUJO DE DATOS PRINCIPAL**

### **1. Flujo de Autenticación**
```
auth.users → auth.sessions → users.user_profiles → users.user_roles
```

### **2. Flujo de Planes de Refuerzo**
```
auth.users (teacher) → plans.plans → plans.plan_jobs → plans.plan_results
                     ↓
                academic.subjects
                     ↓
                files.files (input)
```

### **3. Flujo de Chat**
```
auth.users → chat.chat_sessions → chat.chat_messages → chat.chat_files
```

### **4. Flujo de Analytics**
```
plans.plans → analytics.plan_metrics
auth.users → analytics.user_metrics
academic.subjects → analytics.academic_metrics
```

---

## 🔒 **POLÍTICAS DE ACCESO POR ROL**

### **Admin**
- Acceso completo a todos los esquemas
- Gestión de organizaciones
- Configuración de sistema

### **Teacher**
- Acceso a sus planes y resultados
- Gestión de cursos asignados
- Chat y archivos propios

### **Student**
- Acceso a resultados de planes
- Chat personal
- Archivos compartidos

### **Parent**
- Acceso a resultados de hijos
- Chat limitado
- Archivos compartidos

---

## 📊 **MÉTRICAS DE DISEÑO**

### **Estadísticas de Entidades**
- **Total de Tablas**: 25
- **Total de Esquemas**: 8
- **Relaciones Directas**: 15+
- **Relaciones Cruzadas**: 10+
- **Índices Recomendados**: 20+

### **Distribución por Dominio**
- **Auth**: 3 tablas (12%)
- **Users**: 3 tablas (12%)
- **Organizations**: 2 tablas (8%)
- **Academic**: 4 tablas (16%)
- **Plans**: 4 tablas (16%)
- **Chat**: 3 tablas (12%)
- **Analytics**: 3 tablas (12%)
- **Files**: 3 tablas (12%)

---

Este diagrama visual complementa el ERD detallado y proporciona una vista clara de las relaciones entre entidades en la base de datos compartida. 