# 🗄️ Database Migration Service

## 📋 Descripción

Servicio centralizado para gestionar todas las migraciones de PostgreSQL en la plataforma Profe. Este servicio proporciona una API REST para ejecutar, monitorear y gestionar migraciones de base de datos.

## 🚀 Inicio Rápido

### **Opción 1: Usar el script de inicio (Recomendado)**
```bash
# Desde el directorio backend/
./start-docker.sh
```

### **Opción 2: Inicio manual**
```bash
# Construir y levantar servicios
cd db-migrations-service
docker-compose build
docker-compose up -d

# Verificar estado
docker-compose ps
```

## 📊 **Endpoints de la API**

### **Health Checks**
- `GET /health` - Estado general del servicio
- `GET /health/database` - Estado de la base de datos de migraciones
- `GET /health/master-database` - Estado de la base de datos principal

### **Migraciones**
- `GET /api/migrations/status` - Estado actual de las migraciones
- `GET /api/migrations/history` - Historial de migraciones
- `POST /api/migrations/run` - Ejecutar migraciones
- `POST /api/migrations/rollback` - Revertir migraciones
- `POST /api/migrations/validate` - Validar archivos de migración

### **Backups**
- `POST /api/backup/create` - Crear backup de la base de datos
- `GET /api/backup/list` - Listar backups disponibles
- `POST /api/backup/restore/{backup_id}` - Restaurar backup
- `DELETE /api/backup/{backup_id}` - Eliminar backup

## 🗄️ **Estructura de Base de Datos**

### **Esquemas Creados**
- `auth` - Autenticación y autorización
- `users` - Gestión de usuarios y perfiles
- `organizations` - Organizaciones y configuración
- `academic` - Materias, cursos y contenido académico
- `plans` - Planes de refuerzo y resultados
- `chat` - Sesiones de chat y mensajes
- `analytics` - Métricas y reportes
- `files` - Gestión de archivos y metadata

### **Migraciones Implementadas**
1. `0001_create_schemas.py` - Crear todos los esquemas
2. `0002_create_auth_tables.py` - Tablas de autenticación
3. `0003_create_users_tables.py` - Tablas de usuarios
4. `0004_create_organizations_tables.py` - Tablas de organizaciones
5. `0005_create_plans_tables.py` - Tablas de planes

## 🔧 **Comandos Útiles**

### **Verificar Estado**
```bash
# Estado del servicio
curl http://localhost:3009/health

# Estado de migraciones
curl http://localhost:3009/api/migrations/status

# Estado de la base de datos
curl http://localhost:3009/health/database
```

### **Ejecutar Migraciones**
```bash
# Ejecutar todas las migraciones
curl -X POST http://localhost:3009/api/migrations/run

# Ejecutar con parámetros
curl -X POST "http://localhost:3009/api/migrations/run?service=auth-service&environment=production"
```

### **Crear Backup**
```bash
# Crear backup
curl -X POST "http://localhost:3009/api/backup/create?service=auth-service&description=Pre-deployment"

# Listar backups
curl http://localhost:3009/api/backup/list
```

### **Docker Commands**
```bash
# Ver logs del servicio
docker-compose logs -f db-migrations-service

# Ejecutar comandos en el contenedor
docker-compose exec db-migrations-service alembic current

# Reiniciar el servicio
docker-compose restart db-migrations-service

# Puertos de servicios:
# - PostgreSQL (migrations): localhost:5437
# - PostgreSQL (auth): localhost:5438
# - PostgreSQL (plans): localhost:5439
# - PostgreSQL (chat): localhost:5440
# - Redis: localhost:6379
# - Migration Service: localhost:3009
```

## 📁 **Estructura de Archivos**

```
db-migrations-service/
├── src/
│   ├── api/routes/          # Endpoints de la API
│   ├── core/               # Configuración y base de datos
│   ├── models/             # Modelos SQLAlchemy
│   ├── services/           # Lógica de negocio
│   └── utils/              # Utilidades
├── migrations/
│   ├── versions/           # Archivos de migración
│   └── env.py              # Configuración de Alembic
├── seeds/                  # Datos iniciales
├── config/                 # Configuraciones
├── tests/                  # Tests
├── docs/                   # Documentación
├── Dockerfile              # Imagen Docker
├── docker-compose.yml      # Orquestación
├── requirements.txt        # Dependencias Python
├── alembic.ini            # Configuración Alembic
├── start.sh               # Script de inicio
└── README.md              # Este archivo
```

## 🔒 **Seguridad**

### **Variables de Entorno**
- `DATABASE_URL` - URL de la base de datos de migraciones
- `MASTER_DATABASE_URL` - URL de la base de datos principal
- `REDIS_URL` - URL de Redis
- `BACKUP_STORAGE` - Almacenamiento de backups

### **Políticas de Acceso**
- **Row Level Security (RLS)** en tablas sensibles
- **Validación de esquemas** antes de aplicar migraciones
- **Backup automático** antes de migraciones críticas

## 📊 **Monitoreo**

### **Métricas Disponibles**
- Estado de migraciones por servicio
- Tiempo de ejecución de migraciones
- Tamaño de bases de datos
- Conexiones activas
- Errores de migración

### **Logs**
- Logs estructurados con structlog
- Niveles de log configurables
- Rotación automática de logs

## 🚀 **Desarrollo**

### **Agregar Nueva Migración**
```bash
# Crear nueva migración
docker-compose exec db-migrations-service alembic revision --autogenerate -m "Add new table"

# Aplicar migración
docker-compose exec db-migrations-service alembic upgrade head
```

### **Crear Seed Data**
```bash
# Crear archivo de seed
touch seeds/auth-service/001_default_roles.sql

# Ejecutar seeds
curl -X POST http://localhost:3009/api/seeds/run
```

## 🔧 **Troubleshooting**

### **Problemas Comunes**

#### **Servicio no inicia**
```bash
# Verificar logs
docker-compose logs db-migrations-service

# Verificar conectividad de base de datos
docker-compose exec db-migrations-service pg_isready -h postgres
```

#### **Migraciones fallan**
```bash
# Verificar estado actual
docker-compose exec db-migrations-service alembic current

# Verificar historial
docker-compose exec db-migrations-service alembic history

# Revertir migración
docker-compose exec db-migrations-service alembic downgrade -1
```

#### **Backup falla**
```bash
# Verificar espacio en disco
docker-compose exec db-migrations-service df -h

# Verificar permisos
docker-compose exec db-migrations-service ls -la /app/backups
```

## 📚 **Documentación Adicional**

- [ERD Database Design](../ERD_DATABASE_DESIGN.md) - Diseño detallado del ERD
- [ERD Visual Diagram](../ERD_VISUAL_DIAGRAM.md) - Diagrama visual de relaciones
- [Backend README](../README.md) - Documentación general del backend

---

Este servicio proporciona la base sólida para la gestión centralizada de migraciones en la plataforma Profe. 