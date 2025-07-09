# 🗄️ Backend - Profe Platform

## 📋 Descripción General

Este directorio contiene la arquitectura backend para la plataforma Profe, diseñada con microservicios y una base de datos PostgreSQL compartida. El enfoque principal es el **Database Migration Service** que centraliza todas las migraciones de base de datos.

---

## 🏗️ **ARQUITECTURA**

### **Estrategia de Base de Datos**
- **Base de datos compartida** PostgreSQL para todos los microservicios
- **Separación por esquemas** para organizar las tablas por dominio
- **Migraciones centralizadas** a través del Database Migration Service
- **Relaciones directas** entre entidades de diferentes servicios

### **Estructura de Directorios**
```
backend/
├── db-migrations-service/     # Servicio de migración centralizada
│   ├── src/                  # Código fuente del servicio
│   ├── migrations/           # Migraciones por esquema
│   ├── seeds/               # Datos iniciales
│   ├── config/              # Configuraciones
│   └── tests/               # Tests del servicio
├── ERD_DATABASE_DESIGN.md   # Diseño detallado del ERD
├── ERD_VISUAL_DIAGRAM.md    # Diagrama visual de relaciones
└── README.md                # Este archivo
```

---

## 🗄️ **DATABASE MIGRATION SERVICE**

### **Propósito**
El Database Migration Service es el componente central que gestiona todas las migraciones de PostgreSQL para la plataforma Profe. Proporciona:

- **Migraciones centralizadas** para todos los microservicios
- **Gestión de esquemas** organizados por dominio
- **Backup y restore** automatizados
- **Monitoreo** de estado de bases de datos
- **Seed data** para datos iniciales

### **Características Principales**
- ✅ **Migraciones por servicio** individual
- ✅ **Rollback** de migraciones específicas
- ✅ **Validación** de esquemas antes de aplicar
- ✅ **Backup automático** antes de migraciones
- ✅ **Monitoreo** en tiempo real
- ✅ **Integración** con todos los microservicios

---

## 📊 **ESQUEMAS DE BASE DE DATOS**

### **Organización por Dominio**
```
profe_database/
├── public/              # Tablas compartidas
├── auth/                # Autenticación y autorización
├── users/               # Gestión de usuarios
├── organizations/       # Organizaciones
├── academic/            # Materias y cursos
├── plans/               # Planes de refuerzo
├── chat/                # Sesiones de chat
├── analytics/           # Métricas y reportes
└── files/               # Gestión de archivos
```

### **Entidades Principales**
- **25 tablas** distribuidas en 8 esquemas
- **Relaciones directas** entre entidades
- **Políticas de seguridad** por rol
- **Índices optimizados** para rendimiento

---

## 🔧 **CONFIGURACIÓN**

### **Variables de Entorno**
```env
# Database Migration Service
MIGRATION_SERVICE_PORT=3009
MIGRATION_SERVICE_MASTER_DB_URL=postgresql://...
MIGRATION_SERVICE_REDIS_URL=redis://...
MIGRATION_SERVICE_BACKUP_STORAGE=s3://backups/
MIGRATION_SERVICE_LOG_LEVEL=info

# Base de Datos Compartida
DATABASE_URL=postgresql://postgres:password@localhost:5432/profe_database
```

### **Docker Compose**
```bash
# Levantar servicios de base de datos
cd db-migrations-service
docker-compose up -d postgres redis

# Ejecutar migraciones
docker-compose up db-migrations-service

# Puertos de servicios:
# - PostgreSQL (migrations): localhost:5437
# - PostgreSQL (auth): localhost:5438
# - PostgreSQL (plans): localhost:5439
# - PostgreSQL (chat): localhost:5440
# - Redis: localhost:6379
# - Migration Service: localhost:3009
```

---

## 📋 **COMANDOS PRINCIPALES**

### **Migraciones**
```bash
# Ejecutar migraciones de un servicio
curl -X POST http://localhost:3009/api/migrations/run \
  -H "Content-Type: application/json" \
  -d '{"service": "auth-service", "environment": "production"}'

# Verificar estado de migraciones
curl http://localhost:3009/api/migrations/status

# Crear backup
curl -X POST http://localhost:3009/api/backup/create \
  -H "Content-Type: application/json" \
  -d '{"service": "auth-service", "description": "Pre-deployment"}'
```

### **Desarrollo**
```bash
# Instalar dependencias
cd db-migrations-service
pip install -r requirements.txt

# Ejecutar en desarrollo
uvicorn src.main:app --reload --port 3009

# Ejecutar tests
pytest tests/
```

---

## 📈 **FLUJO DE TRABAJO**

### **1. Desarrollo de Nuevas Entidades**
1. Definir entidad en `ERD_DATABASE_DESIGN.md`
2. Crear migración en `migrations/[schema]/`
3. Crear seed data en `seeds/[schema]/`
4. Probar migración en desarrollo
5. Desplegar a producción

### **2. Actualización de Esquemas**
1. Crear nueva migración
2. Validar cambios en desarrollo
3. Crear backup automático
4. Aplicar migración
5. Verificar integridad

### **3. Rollback de Cambios**
1. Identificar migración a revertir
2. Crear backup de seguridad
3. Ejecutar rollback
4. Verificar estado de base de datos

---

## 🔒 **SEGURIDAD**

### **Políticas de Acceso**
- **Row Level Security (RLS)** en tablas sensibles
- **Políticas por rol** (admin, teacher, student, parent)
- **Auditoría** de cambios en esquemas
- **Backup automático** antes de migraciones

### **Validaciones**
- **Integridad referencial** entre esquemas
- **Validación de esquemas** antes de aplicar
- **Verificación de permisos** por servicio
- **Logs de auditoría** para cambios

---

## 📊 **MONITOREO**

### **Métricas del Servicio**
- **Estado de migraciones** por servicio
- **Tiempo de ejecución** de migraciones
- **Tamaño de bases de datos**
- **Conexiones activas**
- **Errores de migración**

### **Alertas**
- **Migraciones fallidas**
- **Espacio de disco** bajo
- **Conexiones** excesivas
- **Backups** fallidos

---

## 🚀 **PRÓXIMOS PASOS**

### **Fase 1: Implementación Base**
- [x] Diseño del ERD
- [x] Estructura del Database Migration Service
- [ ] Implementación de migraciones base
- [ ] Configuración de Docker

### **Fase 2: Microservicios Core**
- [ ] Auth Service
- [ ] User Management Service
- [ ] Organization Service
- [ ] Academic Service

### **Fase 3: Servicios Avanzados**
- [ ] Plans Service
- [ ] Chat Service
- [ ] Analytics Service
- [ ] File Service

### **Fase 4: Integración**
- [ ] API Gateway
- [ ] Service Discovery
- [ ] Load Balancing
- [ ] Monitoring y Logging

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- **[ERD_DATABASE_DESIGN.md](./ERD_DATABASE_DESIGN.md)** - Diseño detallado del ERD
- **[ERD_VISUAL_DIAGRAM.md](./ERD_VISUAL_DIAGRAM.md)** - Diagrama visual de relaciones
- **[BACKEND_ENDPOINTS_INVENTORY.md](../frontend/BACKEND_ENDPOINTS_INVENTORY.md)** - Inventario de endpoints

---

Este backend proporciona una base sólida para la arquitectura de microservicios con gestión centralizada de base de datos, facilitando el desarrollo y mantenimiento de la plataforma Profe. 