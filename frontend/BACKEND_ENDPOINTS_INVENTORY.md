# Inventario de Endpoints para Backend con Arquitectura de Microservicios

## 📋 Descripción General

Este documento detalla todos los endpoints necesarios para el backend basado en el análisis de los servicios del frontend. La arquitectura está diseñada para microservicios con separación clara de responsabilidades.

---

## 🏗️ **ARQUITECTURA DE MICROSERVICIOS**

### **Servicios Identificados**
1. **🔐 Auth Service** - Autenticación y autorización
2. **👥 User Management Service** - Gestión de usuarios y roles
3. **🏫 Organization Service** - Gestión organizacional
4. **📚 Academic Service** - Materias, cursos y contenido académico
5. **📋 Plans Service** - Generación y gestión de planes de refuerzo
6. **💬 Chat Service** - Integración con ADK y chat AI
7. **📊 Analytics Service** - Métricas y reportes
8. **📁 File Service** - Gestión de archivos y uploads
9. **🗄️ Database Migration Service** - Centralización de migraciones PostgreSQL

---

## 1. **🔐 AUTH SERVICE**

### **Base URL**: `http://auth-service:3001/api/auth`

#### **Autenticación**
```
POST   /login
POST   /register
POST   /logout
POST   /refresh-token
POST   /reset-password
POST   /verify-reset-token
POST   /change-password
```

#### **Gestión de Sesiones**
```
GET    /session/validate
POST   /session/refresh
DELETE /session/logout
```

#### **Verificación**
```
GET    /verify-email/:token
POST   /resend-verification
```

---

## 2. **👥 USER MANAGEMENT SERVICE**

### **Base URL**: `http://user-service:3002/api/users`

#### **Gestión de Usuarios**
```
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
PATCH  /users/:id/status
```

#### **Gestión de Roles**
```
GET    /users/:id/roles
POST   /users/:id/roles
DELETE /users/:id/roles/:roleId
```

#### **Perfiles de Usuario**
```
GET    /users/:id/profile
PUT    /users/:id/profile
PATCH  /users/:id/profile/avatar
```

#### **Búsqueda y Filtros**
```
GET    /users/search?q=:query
GET    /users?role=:role&status=:status&page=:page&limit=:limit
```

---

## 3. **🏫 ORGANIZATION SERVICE**

### **Base URL**: `http://organization-service:3003/api/organizations`

#### **Gestión de Organizaciones**
```
GET    /organizations/:id
PUT    /organizations/:id
POST   /organizations
DELETE /organizations/:id
```

#### **Configuración Organizacional**
```
GET    /organizations/:id/config
PUT    /organizations/:id/config
```

---

## 4. **📚 ACADEMIC SERVICE**

### **Base URL**: `http://academic-service:3004/api/academic`

#### **Gestión de Materias**
```
GET    /subjects
GET    /subjects/:id
POST   /subjects
PUT    /subjects/:id
DELETE /subjects/:id
GET    /subjects/:id/courses
```

#### **Gestión de Cursos**
```
GET    /courses
GET    /courses/:id
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
GET    /courses/:id/subjects
POST   /courses/:id/subjects/:subjectId
DELETE /courses/:id/subjects/:subjectId
```

---

## 5. **📋 PLANS SERVICE**

### **Base URL**: `http://plans-service:3005/api/plans`

#### **Gestión de Planes**
```
GET    /plans
GET    /plans/:id
POST   /plans
PUT    /plans/:id
DELETE /plans/:id
```

#### **Generación de Planes**
```
POST   /plans/generate
GET    /plans/generate/:jobId/status
POST   /plans/generate/:jobId/cancel
```

#### **Jobs de Generación**
```
GET    /jobs
GET    /jobs/:id
GET    /jobs/teacher/:teacherId
DELETE /jobs/:id
```

#### **Resultados de Planes**
```
GET    /plans/:id/results
GET    /plans/:id/results/students
GET    /plans/:id/results/analytics
POST   /plans/:id/results/export
```

#### **Archivos de Planes**
```
POST   /plans/:id/files/upload
GET    /plans/:id/files
DELETE /plans/:id/files/:fileId
GET    /plans/:id/files/:fileId/download
```

#### **Métricas y Reportes**
```
GET    /plans/analytics/teacher/:teacherId
GET    /plans/analytics/organization/:orgId
GET    /plans/analytics/subject/:subjectId
```

---

## 6. **💬 CHAT SERVICE**

### **Base URL**: `http://chat-service:3006/api/chat`

#### **Gestión de Sesiones**
```
POST   /sessions
GET    /sessions/:id
DELETE /sessions/:id
GET    /sessions/user/:userId
```

#### **Mensajes**
```
POST   /sessions/:sessionId/messages
GET    /sessions/:sessionId/messages
DELETE /sessions/:sessionId/messages/:messageId
```

#### **Integración ADK**
```
POST   /adk/sessions
POST   /adk/run
GET    /adk/sessions/:sessionId
DELETE /adk/sessions/:sessionId
```

#### **Audio y Archivos**
```
POST   /audio/upload
GET    /audio/:id
DELETE /audio/:id
POST   /files/upload
GET    /files/:id
DELETE /files/:id
```

#### **Historial y Contexto**
```
GET    /sessions/:sessionId/history
POST   /sessions/:sessionId/context
GET    /sessions/:sessionId/suggestions
```

---

## 7. **📊 ANALYTICS SERVICE**

### **Base URL**: `http://analytics-service:3007/api/analytics`

#### **Métricas de Usuarios**
```
GET    /users/activity
GET    /users/engagement
GET    /users/performance
```

#### **Métricas de Planes**
```
GET    /plans/performance
GET    /plans/completion-rates
GET    /plans/effectiveness
```

#### **Métricas Académicas**
```
GET    /academic/subject-performance
GET    /academic/course-progress
GET    /academic/student-achievement
```

#### **Reportes**
```
GET    /reports/teachers/:teacherId
GET    /reports/organizations/:orgId
GET    /reports/students/:studentId
POST   /reports/generate
GET    /reports/:id/download
```

#### **Dashboards**
```
GET    /dashboard/teacher/:teacherId
GET    /dashboard/admin/:orgId
GET    /dashboard/student/:studentId
```

---

## 8. **📁 FILE SERVICE**

### **Base URL**: `http://file-service:3008/api/files`

#### **Upload de Archivos**
```
POST   /upload
POST   /upload/multiple
POST   /upload/plan-files
POST   /upload/chat-files
```

#### **Gestión de Archivos**
```
GET    /files/:id
GET    /files/:id/download
GET    /files/:id/metadata
DELETE /files/:id
```

#### **Organización de Archivos**
```
GET    /files/organization/:orgId
GET    /files/user/:userId
GET    /files/plan/:planId
```

#### **Procesamiento**
```
POST   /files/:id/process
GET    /files/:id/process/status
POST   /files/:id/convert
```

---

## 9. **🗄️ DATABASE MIGRATION SERVICE**

### **Base URL**: `http://migration-service:3009/api/migrations`

#### **Gestión de Migraciones**
```
GET    /migrations/status
GET    /migrations/history
POST   /migrations/run
POST   /migrations/rollback
POST   /migrations/validate
```

#### **Migraciones por Servicio**
```
GET    /migrations/service/:serviceName
POST   /migrations/service/:serviceName/run
POST   /migrations/service/:serviceName/rollback
GET    /migrations/service/:serviceName/status
```

#### **Gestión de Esquemas**
```
GET    /schemas
GET    /schemas/:serviceName
POST   /schemas/validate
POST   /schemas/backup
POST   /schemas/restore
```

#### **Monitoreo de Base de Datos**
```
GET    /database/health
GET    /database/connections
GET    /database/performance
GET    /database/size
```

#### **Backup y Restore**
```
POST   /backup/create
GET    /backup/list
POST   /backup/restore/:backupId
DELETE /backup/:backupId
```

#### **Seed Data**
```
POST   /seeds/run
POST   /seeds/run/:serviceName
GET    /seeds/status
POST   /seeds/reset
```

---

## 10. **🔗 API GATEWAY**

### **Base URL**: `http://api-gateway:3000/api`

#### **Rutas Unificadas**
```
GET    /health
GET    /status
POST   /webhooks/:service
```

#### **Autenticación Centralizada**
```
POST   /auth/login
POST   /auth/register
POST   /auth/refresh
```

#### **Proxy de Servicios**
```
GET    /v1/plans
GET    /v1/users
GET    /v1/organizations
GET    /v1/analytics
```

---

## 11. **📋 ENDPOINTS ESPECÍFICOS POR DOMINIO**

---

### **🔐 AUTH SERVICE - Detalles**

#### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "teacher",
    "organizationId": "org-123"
  },
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here"
}
```

#### **Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "teacher",
  "organizationId": "org-123"
}
```

---

### **📋 PLANS SERVICE - Detalles**

#### **Generar Plan**
```http
POST /api/plans/generate
Content-Type: application/json

{
  "teacherId": "teacher-123",
  "subjectId": "subject-456",
  "courseId": "course-789",
  "files": [
    {
      "id": "file-123",
      "name": "exam-results.pdf",
      "type": "application/pdf"
    }
  ],
  "parameters": {
    "difficulty": "medium",
    "focusAreas": ["algebra", "geometry"],
    "duration": "2_weeks"
  }
}

Response:
{
  "jobId": "job-123",
  "status": "processing",
  "estimatedTime": "5_minutes"
}
```

#### **Estado del Job**
```http
GET /api/plans/generate/job-123/status

Response:
{
  "jobId": "job-123",
  "status": "completed",
  "progress": 100,
  "result": {
    "planId": "plan-456",
    "summary": "Plan generado exitosamente",
    "recommendations": ["..."],
    "exercises": [...]
  }
}
```

---

### **💬 CHAT SERVICE - Detalles**

#### **Crear Sesión ADK**
```http
POST /api/chat/adk/sessions
Content-Type: application/json

{
  "app_name": "speaker",
  "user_id": "user-123",
  "session_id": "session-456"
}
```

#### **Enviar Mensaje**
```http
POST /api/chat/adk/run
Content-Type: application/json

{
  "app_name": "speaker",
  "user_id": "user-123",
  "session_id": "session-456",
  "new_message": {
    "role": "user",
    "parts": [
      {
        "text": "Hola, necesito ayuda con un plan de refuerzo"
      }
    ]
  }
}
```

---

### **🗄️ DATABASE MIGRATION SERVICE - Detalles**

#### **Ejecutar Migraciones**
```http
POST /api/migrations/run
Content-Type: application/json

{
  "service": "auth-service",
  "environment": "production",
  "dryRun": false
}

Response:
{
  "migrationId": "migration-123",
  "status": "running",
  "service": "auth-service",
  "migrationsApplied": 5,
  "estimatedTime": "30_seconds"
}
```

#### **Estado de Migraciones**
```http
GET /api/migrations/status

Response:
{
  "services": [
    {
      "name": "auth-service",
      "status": "up_to_date",
      "lastMigration": "2024-01-15T10:30:00Z",
      "pendingMigrations": 0
    },
    {
      "name": "plans-service",
      "status": "pending",
      "lastMigration": "2024-01-10T15:45:00Z",
      "pendingMigrations": 2
    }
  ],
  "overallStatus": "healthy"
}
```

#### **Backup de Base de Datos**
```http
POST /api/backup/create
Content-Type: application/json

{
  "service": "auth-service",
  "description": "Pre-deployment backup",
  "retentionDays": 30
}

Response:
{
  "backupId": "backup-123",
  "service": "auth-service",
  "size": "256MB",
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 12. **🔧 CONFIGURACIÓN DE MICROSERVICIOS**

### **Variables de Entorno por Servicio**

#### **Auth Service**
```env
AUTH_SERVICE_PORT=3001
AUTH_SERVICE_DB_URL=postgresql://...
AUTH_SERVICE_JWT_SECRET=your-jwt-secret
AUTH_SERVICE_REDIS_URL=redis://...
AUTH_SERVICE_MIGRATION_SERVICE=http://migration-service:3009
```

#### **Plans Service**
```env
PLANS_SERVICE_PORT=3005
PLANS_SERVICE_DB_URL=postgresql://...
PLANS_SERVICE_AI_ENDPOINT=http://ai-service:3010
PLANS_SERVICE_FILE_SERVICE=http://file-service:3008
PLANS_SERVICE_MIGRATION_SERVICE=http://migration-service:3009
```

#### **Chat Service**
```env
CHAT_SERVICE_PORT=3006
CHAT_SERVICE_ADK_URL=http://adk-server:8000
CHAT_SERVICE_REDIS_URL=redis://...
CHAT_SERVICE_FILE_SERVICE=http://file-service:3008
CHAT_SERVICE_MIGRATION_SERVICE=http://migration-service:3009
```

#### **Database Migration Service**
```env
MIGRATION_SERVICE_PORT=3009
MIGRATION_SERVICE_MASTER_DB_URL=postgresql://...
MIGRATION_SERVICE_REDIS_URL=redis://...
MIGRATION_SERVICE_BACKUP_STORAGE=s3://backups/
MIGRATION_SERVICE_LOG_LEVEL=info
```

---

## 13. **📊 BASE DE DATOS POR SERVICIO**

### **Auth Service**
- **Database**: PostgreSQL
- **Tables**: users, sessions, refresh_tokens, password_resets
- **Migration Path**: `/migrations/auth-service/`

### **User Management Service**
- **Database**: PostgreSQL
- **Tables**: user_profiles, user_roles, user_preferences
- **Migration Path**: `/migrations/user-service/`

### **Organization Service**
- **Database**: PostgreSQL
- **Tables**: organizations, organization_configs
- **Migration Path**: `/migrations/organization-service/`

### **Academic Service**
- **Database**: PostgreSQL
- **Tables**: subjects, courses, subject_courses
- **Migration Path**: `/migrations/academic-service/`

### **Plans Service**
- **Database**: PostgreSQL
- **Tables**: plans, plan_jobs, plan_results, plan_files
- **Migration Path**: `/migrations/plans-service/`

### **Chat Service**
- **Database**: PostgreSQL + Redis
- **Tables**: chat_sessions, chat_messages, chat_files
- **Migration Path**: `/migrations/chat-service/`

### **Analytics Service**
- **Database**: PostgreSQL + TimescaleDB
- **Tables**: user_metrics, plan_metrics, academic_metrics
- **Migration Path**: `/migrations/analytics-service/`

### **File Service**
- **Storage**: MinIO/S3
- **Database**: PostgreSQL
- **Tables**: files, file_metadata, file_permissions
- **Migration Path**: `/migrations/file-service/`

### **Database Migration Service**
- **Database**: PostgreSQL (master)
- **Tables**: migration_history, backup_history, service_status
- **Storage**: S3/MinIO para backups

---

## 14. **🚀 ESTRATEGIA DE IMPLEMENTACIÓN**

### **Fase 1: Servicios Core**
1. Database Migration Service
2. Auth Service
3. User Management Service
4. Organization Service

### **Fase 2: Servicios Académicos**
1. Academic Service
2. Plans Service
3. File Service

### **Fase 3: Servicios Avanzados**
1. Chat Service
2. Analytics Service
3. API Gateway

### **Fase 4: Integración y Optimización**
1. Service Discovery
2. Load Balancing
3. Monitoring y Logging

---

## 15. **📈 MÉTRICAS ACTUALIZADAS**

### **Endpoints por Servicio (Simplificado)**
- **Auth Service**: 10 endpoints
- **User Management**: 15 endpoints
- **Organization**: 5 endpoints (simplificado)
- **Academic**: 10 endpoints (simplificado)
- **Plans**: 25 endpoints
- **Chat**: 20 endpoints
- **Analytics**: 20 endpoints
- **File**: 15 endpoints
- **Database Migration**: 20 endpoints
- **API Gateway**: 10 endpoints

### **Total de Endpoints**: 150+ (incluyendo migraciones)

---

## 16. **🗄️ ESTRUCTURA DE MIGRACIONES**

### **Organización de Archivos**
```
migration-service/
├── migrations/
│   ├── auth-service/
│   │   ├── 001_create_users_table.sql
│   │   ├── 002_create_sessions_table.sql
│   │   └── 003_add_user_roles.sql
│   ├── plans-service/
│   │   ├── 001_create_plans_table.sql
│   │   ├── 002_create_plan_jobs_table.sql
│   │   └── 003_create_plan_results_table.sql
│   └── shared/
│       ├── 001_create_organizations_table.sql
│       └── 002_create_subjects_table.sql
├── seeds/
│   ├── auth-service/
│   │   └── 001_default_roles.sql
│   └── academic-service/
│       └── 001_default_subjects.sql
└── config/
    ├── database.yml
    └── services.yml
```

### **Comandos de Migración**
```bash
# Ejecutar migraciones de un servicio
curl -X POST http://migration-service:3009/api/migrations/run \
  -H "Content-Type: application/json" \
  -d '{"service": "auth-service", "environment": "production"}'

# Verificar estado de migraciones
curl http://migration-service:3009/api/migrations/status

# Crear backup
curl -X POST http://migration-service:3009/api/backup/create \
  -H "Content-Type: application/json" \
  -d '{"service": "auth-service", "description": "Pre-deployment"}'
```

---

Este inventario actualizado incluye el servicio de migración de bases de datos que centraliza toda la gestión de PostgreSQL, proporcionando control total sobre las actualizaciones de esquemas y datos. 