UNIVERSIDAD RAFAEL LANDÍVAR
FACULTAD DE INGENIERÍA
INGENIERÍA EN INFORMÁTICA Y SISTEMAS
CURSO: PROGRAMACIÓN WEB
CATEDRÁTICO: ING. RONALD LEONEL AYALA GARRIDO
SEGUNDO SEMESTRE 2026

PROYECTO FINAL: APLICACIÓN WEB FUNCIONAL
RESERVEHUB — SISTEMA WEB DE RESERVAS DE ESPACIOS

INTEGRANTES DEL EQUIPO DE TRABAJO:
- Walter José Herrera Salvatierra — 1109722
- Boris Garzona — 1218122
- Jonathan García — 1045222
- Samuel Ruiz — 1228722
- Giancarlo Ortega — 1230222
- Mario López — 2477123

FECHA DE ENTREGA: 5 DE NOVIEMBRE DE 2026

================================================================================

1. INFORMACIÓN GENERAL Y ENLACES DEL PROYECTO

1.1 Enlaces de Despliegue en Producción
- Frontend (Aplicación Web en Vercel):
  https://proyecto-final-progra-web-theta.vercel.app

- Backend API (Servicio REST en Render):
  https://reservehub-backend-881f.onrender.com/api/health

- Repositorio de Código Fuente (GitHub):
  https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb

- Historial de Integración Continua (GitHub Actions):
  https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb/actions

1.2 Descripción del Proyecto
ReserveHub es una aplicación web para la administración y reservación de espacios físicos dentro de la universidad (aulas, salas de conferencias, laboratorios de cómputo y auditorios). El sistema permite consultar la disponibilidad en tiempo real, evitar el solapamiento de horarios mediante validación algorítmica, gestionar usuarios con diferentes roles (estudiantes y administradores) y mantener la información persistente en una base de datos relacional.

================================================================================

2. CREDENCIALES DE ACCESO PARA EVALUACIÓN

Para la verificación y calificación de los flujos de usuario y administrador dentro del sistema, se han configurado las siguientes cuentas de prueba:

2.1 Cuenta con Rol de Administrador
- Correo electrónico: admin@reservehub.com
- Contraseña: Admin123!
- Funciones disponibles:
  * Acceso al módulo de administración (/admin).
  * Registro, edición y deshabilitación de espacios físicos.
  * Visualización de todas las reservaciones registradas por los usuarios.
  * Cambio de estado de reservas (Confirmada, Cancelada, Finalizada).
  * Consulta del listado de usuarios y cantidad de reservas realizadas.

2.2 Cuenta con Rol de Usuario General
- Correo electrónico: jonathan@reservehub.com
- Contraseña: User123!
- Funciones disponibles:
  * Consulta del catálogo de espacios y filtrado por fecha y capacidad.
  * Verificación interactiva de horarios disponibles por día.
  * Creación de reservaciones sin conflicto de horarios.
  * Visualización y cancelación de reservaciones propias (/my-reservations).

2.3 Cuenta de Usuario Secundario (Pruebas de Concurrencia)
- Correo electrónico: walter@reservehub.com
- Contraseña: User123!
- Funciones disponibles:
  * Validación de reglas de no solapamiento entre distintos usuarios para un mismo espacio y horario.

================================================================================

3. STACK TECNOLÓGICO Y ARQUITECTURA

El proyecto fue desarrollado bajo una arquitectura desacoplada cliente-servidor compuesta por tres niveles:

3.1 Frontend
- Framework: React 19 con TypeScript.
- Herramienta de compilación: Vite.
- Enrutamiento: React Router.
- Estilos: CSS moderno y responsivo mediante Tailwind CSS (sin uso de plantillas externas de terceros).
- Gestión de estado: React Context API (AuthContext) con persistencia de token JWT en el cliente.
- Despliegue: Vercel CDN con redirección SPA configurada.

3.2 Backend
- Entorno de ejecución: Node.js (versión 22).
- Framework web: Express 5 con TypeScript.
- Arquitectura de código: Separación modular por capas (Rutas, Controladores, Servicios, Middlewares y Validadores).
- Validación de datos: Esquemas estrictos con Zod para req.body, req.params y req.query.
- Seguridad: Helmet para cabeceras HTTP seguras, CORS habilitado y manejo seguro de variables de entorno mediante archivos .env.
- Despliegue: Render Web Service.

3.3 Base de Datos y Persistencia
- Motor de base de datos: PostgreSQL 16.
- ORM: Prisma ORM.
- Modelos de datos:
  * users (id, name, email, password, role, created_at, updated_at).
  * spaces (id, name, description, location, capacity, image_url, status, created_at, updated_at).
  * reservations (id, user_id, space_id, reservation_date, start_time, end_time, status, notes, created_at, updated_at).
  * schedules (id, space_id, day_of_week, opening_time, closing_time, status).
- Relaciones: Llaves foráneas con eliminación y actualización en cascada.
- Índices: Índices compuestos sobre (space_id, reservation_date) y (user_id).

3.4 Autenticación y Autorización
- Cifrado de contraseñas: Algoritmo de hash bcryptjs con factor de coste de 10 rondas de salting.
- Manejo de sesiones: Tokens JWT (JSON Web Tokens) firmados con algoritmo HMAC SHA-256 enviados en el encabezado Authorization (Bearer).
- Control de acceso basado en roles: Middlewares authenticateToken y requireAdmin para proteger rutas privadas y de administración.

3.5 Pruebas Automatizadas
- Backend: Pruebas unitarias y de integración con Vitest y Supertest, cubriendo rutas de autenticación, verificación de salud, consulta de espacios y rechazo de solapamiento de horarios.
- Frontend: Pruebas de renderizado de componentes con Vitest y Testing Library.

3.6 Contenerización y CI/CD
- Docker: Dockerfile multi-etapa para backend y frontend con Nginx, y docker-compose.yml para orquestar la base de datos PostgreSQL, el backend y el frontend.
- CI/CD: Flujo de trabajo en GitHub Actions (.github/workflows/ci.yml) que ejecuta linting, compilación de TypeScript, migración de esquemas en una base de datos PostgreSQL de prueba y ejecución de pruebas automatizadas en cada confirmación (push).

================================================================================

4. REGLAS DE NEGOCIO IMPLEMENTADAS

- RN-01: Un espacio no puede tener dos reservas confirmadas o pendientes que se solapen en la misma fecha y rango horario. Condición evaluada: (nuevaInicio < existenteFin) Y (nuevaFin > existenteInicio).
- RN-02: Se requiere autenticación válida mediante token JWT para registrar cualquier reservación.
- RN-03: Los usuarios con rol de usuario general únicamente pueden cancelar sus propias reservaciones. El administrador tiene autorización para gestionar el estado de cualquier reserva.
- RN-04: El administrador puede visualizar y modificar el estado de todas las reservaciones del sistema.
- RN-05: El sistema bloquea automáticamente solicitudes de reservación sobre espacios marcados como inactivos o deshabilitados.
- RN-06: Toda reservación valida obligatoriamente que la hora de inicio sea estrictamente menor a la hora de finalización.
- RN-07: No se permite la creación de reservaciones con fecha anterior a la fecha actual del sistema.
- RN-08: Cada reservación queda ligada a un identificador de usuario y de espacio existentes en la base de datos.
- RN-09: Las reservas transitan por los estados: PENDING (pendiente), CONFIRMED (confirmada), CANCELLED (cancelada) y COMPLETED (finalizada).

================================================================================

5. PANTALLAS PRINCIPALES DEL SISTEMA

1. Pantalla de Inicio (/): Presentación de la plataforma, resumen de características y catálogo de espacios destacados.
2. Pantalla de Iniciar Sesión (/login): Formulario de autenticación con validación de campos y accesos directos de prueba.
3. Pantalla de Registro (/register): Creación de cuenta de usuario con validación de datos y confirmación de contraseña.
4. Pantalla de Catálogo de Espacios (/spaces): Listado de salones con filtros por nombre/ubicación, selector de fecha y capacidad mínima de asistentes.
5. Pantalla de Realizar Reserva (/reserve/:id): Selección de fecha, visualización interactiva de franjas horarias con slots disponibles y ocupados, ingreso de observaciones y confirmación de reserva.
6. Pantalla de Mis Reservas (/my-reservations): Listado histórico de reservas del usuario en sesión, estado de cada una y opción de cancelación.
7. Pantalla de Panel de Administrador (/admin): Pestañas para gestión global de reservaciones, administración de espacios (crear, editar, deshabilitar) y listado de usuarios.

================================================================================

6. INSTRUCCIONES DE EJECUCIÓN EN ENTORNO LOCAL CON DOCKER

Si se requiere ejecutar la solución completa en una máquina local sin dependencias previas de desarrollo:

Prerrequisitos:
- Docker Desktop instalado y en ejecución.

Comando de inicio (desde la raíz del proyecto):
  docker compose up -d --build

Servicios disponibles tras la ejecución:
- Aplicación Frontend: http://localhost:5173
- API REST Backend: http://localhost:4000/api/health
- Base de datos PostgreSQL: localhost:5432

Comando de detención:
  docker compose down

================================================================================

7. MATRIZ DE CUMPLIMIENTO DE LA RÚBRICA DE EVALUACIÓN (25 PUNTOS)

| Criterio Evaluado                           | Puntos | Justificación Técnica Implementada                                      |
| :------------------------------------------ | :----: | :---------------------------------------------------------------------- |
| 1. Análisis y diseño                        |  3.0   | Requerimientos funcionales, no funcionales, reglas, modelo y diagrama.  |
| 2. Frontend — React + TypeScript            |  5.5   | 7 pantallas prototipadas funcionales, responsivas y modulares.          |
| 3. Backend — Express + TypeScript           |  4.0   | API REST estructurada por capas con validación de esquemas Zod.         |
| 4. Base de datos — PostgreSQL + Prisma      |  3.0   | Modelo relacional normalizado con migraciones y sembrado de datos.      |
| 5. Seguridad                                |  2.0   | Hashing bcrypt, tokens JWT, Helmet, CORS y control de acceso RBAC.      |
| 6. Pruebas de software                      |  1.5   | Suites automatizadas de backend y frontend ejecutadas con Vitest.       |
| 7. Git/GitHub y trabajo colaborativo        |  1.5   | Repositorio estructurado con historial de confirmaciones semánticas.    |
| 8. Docker + CI/CD                           |  1.5   | Archivos Dockerfile, docker-compose y flujo de trabajo en GitHub Actions.|
| 9. Despliegue, accesibilidad y rendimiento  |  1.5   | Despliegue público en producción activo en Vercel y Render.             |
| 10. Documentación y defensa técnica         |  1.5   | Documentación técnica, manual de API y guía de defensa del proyecto.   |
| TOTAL                                       |  25.0  | Proyecto completo y funcional listo para revisión y defensa técnica.    |
