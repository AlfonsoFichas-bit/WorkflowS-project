# Frontend Implementation Tracker

Este documento trackingea qué endpoints de la API faltan por implementar en el frontend. Marcaremos los completados con ✅ y los pendientes con ❌.

**Total endpoints en API:** 68  
**Endpoints implementados:** ~35  
**Endpoints faltantes:** ~33 (48%)

---

## 🔔 Notificaciones (0/3 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `GET /api/notifications` | GET | ❌ | Obtener todas las notificaciones del usuario |
| `POST /api/notifications/read/all` | POST | ❌ | Marcar todas las notificaciones como leídas |
| `POST /api/notifications/:id/read` | POST | ❌ | Marcar notificación específica como leída |

---

## 📊 Reportes (1/3 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `GET /api/projects/:id/reports/velocity` | GET | ❌ | Reporte de velocidad del proyecto |
| `GET /api/sprints/:id/reports/burndown` | GET | ❌ | Gráfico burndown del sprint |
| `GET /api/sprints/:id/reports/commitment` | GET | ✅ | Reporte compromiso vs completado (SprintManagementIsland.tsx:277) |

---

## 📋 Rúbricas (0/6 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/rubrics` | POST | ❌ | Crear nueva rúbrica |
| `GET /api/rubrics` | GET | ❌ | Obtener todas las rúbricas |
| `GET /api/rubrics/:id` | GET | ❌ | Obtener rúbrica específica |
| `PUT /api/rubrics/:id` | PUT | ❌ | Actualizar rúbrica |
| `DELETE /api/rubrics/:id` | DELETE | ❌ | Eliminar rúbrica |
| `POST /api/rubrics/:id/duplicate` | POST | ❌ | Duplicar rúbrica existente |

---

## 📅 Calendario de Eventos (0/4 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/projects/:id/events` | POST | ❌ | Crear evento en proyecto |
| `GET /api/projects/:id/events` | GET | ❌ | Obtener eventos del proyecto |
| `PUT /api/events/:id` | PUT | ❌ | Actualizar evento |
| `DELETE /api/events/:id` | DELETE | ❌ | Eliminar evento |

---

## 📤 Exportación de Datos (0/1 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `GET /api/projects/:id/export` | GET | ❌ | Exportar proyecto a CSV |

---

## 👥 Usuarios (1/2 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `GET /api/me` | GET | ✅ | Obtener usuario actual (múltiples componentes) |
| `GET /api/users/:id` | GET | ❌ | Obtener usuario específico |

---

## 🏃‍♂️ Sprints (4/7 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/projects/:id/sprints` | POST | ✅ | Crear sprint (SprintManagementIsland.tsx) |
| `GET /api/projects/:id/sprints` | GET | ✅ | Obtener sprints del proyecto |
| `GET /api/sprints/:sprintId` | GET | ❌ | Obtener sprint específico |
| `PUT /api/sprints/:sprintId` | PUT | ✅ | Actualizar sprint (SprintManagementIsland.tsx:197) |
| `DELETE /api/sprints/:sprintId` | DELETE | ❌ | Eliminar sprint |
| `PUT /api/sprints/:sprintId/status` | PUT | ❌ | Actualizar estado del sprint |
| `POST /api/sprints/:sprintId/userstories` | POST | ✅ | Asignar HU a sprint (SprintAssignmentIsland.tsx:182) |

---

## 💬 Comentarios de Tareas (1/2 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/tasks/:id/comments` | POST | ❌ | Añadir comentario a tarea |
| `GET /api/tasks/:id/comments` | GET | ✅ | Obtener comentarios de tarea (TasksManagementIsland.tsx:893) |

---

## 📝 Historias de Usuario (5/5 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/projects/:id/userstories` | POST | ✅ | Crear HU (UserStoriesIsland.tsx:355) |
| `GET /api/projects/:id/userstories` | GET | ✅ | Obtener HUs del proyecto |
| `GET /api/userstories/:storyId` | GET | ✅ | Obtener HU específica |
| `PUT /api/userstories/:storyId` | PUT | ✅ | Actualizar HU (UserStoriesIsland.tsx:228) |
| `DELETE /api/userstories/:storyId` | DELETE | ✅ | Eliminar HU (UserStoriesIsland.tsx:305) |

---

## 🔧 Tareas (8/8 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/userstories/:storyId/tasks` | POST | ✅ | Crear tarea (TasksManagementIsland.tsx:309) |
| `GET /api/userstories/:storyId/tasks` | GET | ✅ | Obtener tareas de HU |
| `PUT /api/tasks/:taskId` | PUT | ✅ | Actualizar tarea (TasksManagementIsland.tsx:403) |
| `DELETE /api/tasks/:taskId` | DELETE | ✅ | Eliminar tarea (TasksManagementIsland.tsx:390) |
| `PUT /api/tasks/:taskId/assign` | PUT | ✅ | Asignar tarea a usuario |
| `PUT /api/tasks/:taskId/status` | PUT | ✅ | Actualizar estado tarea (KanbanBoardIsland.tsx:70) |
| `POST /api/tasks/:id/comments` | POST | ✅ | Añadir comentario |
| `GET /api/tasks/:id/comments` | GET | ✅ | Obtener comentarios |

---

## 📈 Evaluaciones de Tareas (2/2 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/tasks/:taskId/evaluations` | POST | ✅ | Crear evaluación (TasksManagementIsland.tsx:909) |
| `GET /api/tasks/:taskId/evaluations` | GET | ✅ | Obtener evaluaciones (TasksManagementIsland.tsx:928) |

---

## 🏢 Proyectos (7/7 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /api/projects` | POST | ✅ | Crear proyecto (ProjectsIsland.tsx:59) |
| `GET /api/projects` | GET | ✅ | Obtener proyectos |
| `GET /api/projects/:id` | GET | ✅ | Obtener proyecto específico |
| `PUT /api/projects/:id` | PUT | ✅ | Actualizar proyecto (ProjectsIsland.tsx:104) |
| `DELETE /api/projects/:id` | DELETE | ✅ | Eliminar proyecto (ProjectsIsland.tsx:149) |
| `GET /api/projects/:id/unassigned-users` | GET | ✅ | Usuarios no asignados (ProjectsIsland.tsx:287) |
| `GET /api/projects/:id/members` | GET | ✅ | Miembros del proyecto (ProjectsIsland.tsx:314) |

---

## 🔐 Autenticación (2/2 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `POST /login` | POST | ✅ | Login (LoginIsland.tsx:15) |
| `POST /create-admin` | POST | ✅ | Crear admin (RegisterIsland.tsx:26) |

---

## 👑 Administración (5/5 implementados)

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `GET /api/admin/users` | GET | ✅ | Obtener usuarios (UserManagementIsland.tsx:68) |
| `POST /api/admin/users` | POST | ✅ | Crear usuario (UserManagementIsland.tsx:220) |
| `PUT /api/admin/users/:id` | PUT | ✅ | Actualizar usuario (UserManagementIsland.tsx:116) |
| `DELETE /api/admin/users/:id` | DELETE | ✅ | Eliminar usuario (UserManagementIsland.tsx:160) |
| `POST /api/admin/projects/:id/members` | POST | ✅ | Añadir miembro (ProjectsIsland.tsx:247) |

---

## 🎯 Prioridades Sugeridas

### **Alta Prioridad (UX Crítica)**
1. 🔔 **Notificaciones** - Sistema completo faltante
2. 📊 **Reportes burndown y velocity** - Métricas ágiles esenciales

### **Media Prioridad (Funcionalidad)**
3. 📅 **Calendario de Eventos** - Organización del equipo
4. 📤 **Exportación CSV** - Reportes para stakeholders
5. 📋 **Rúbricas** - Si usas evaluaciones de calidad

### **Baja Prioridad (Completitud)**
6. 👥 **Usuarios específicos** - Detalles de usuario
7. 🏃‍♂️ **Sprints completos** - Estados y eliminación
8. 💬 **Completar comentarios** - POST de comentarios

---

## 📈 Progreso General

- **Completado:** 52% (35/68 endpoints)
- **En Progreso:** 0%
- **Pendiente:** 48% (33/68 endpoints)

**Última actualización:** 2025-11-11