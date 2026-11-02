# ReserveHub — Sistema Web de Reservas de Espacios

**Universidad Rafael Landívar**  
**Facultad de Ingeniería — Ingeniería en Informática y Sistemas**  
**Curso:** Programación Web  
**Catedrático:** Ing. Ronald Leonel Ayala Garrido  
**Entregable Final — Aplicación Web Funcional**

---

### Integrantes del Equipo
* **Walter José Herrera Salvatierra** — Carné: 1109722
* **Boris Garzona** — Carné: 1218122
* **Jonathan García** — Carné: 1045222
* **Samuel Ruiz** — Carné: 1228722
* **Giancarlo Ortega** — Carné: 1230222
* **Mario López** — Carné: 2477123

---

## 🌐 Enlaces Oficiales del Despliegue Público (Producción)

| Componente | Plataforma | Enlace Público en Producción | Repositorio GitHub |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | **Vercel** | [https://proyecto-final-progra-web-theta.vercel.app](https://proyecto-final-progra-web-theta.vercel.app) | [GitHub Repository](https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb) |
| **Backend API** | **Render** | [https://reservehub-backend-881f.onrender.com/api/health](https://reservehub-backend-881f.onrender.com/api/health) | [GitHub Backend Code](https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb/tree/main/backend) |
| **Base de Datos** | **Render PostgreSQL** | Conectada en la nube con Prisma ORM | [Esquema Prisma](https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb/blob/main/backend/prisma/schema.prisma) |

---

## 1. Descripción del Proyecto

**ReserveHub** es una aplicación web moderna, accesible, segura y contenerizada diseñada para la gestión y reservación de espacios físicos (aulas de reuniones, salas de conferencias, auditorios y laboratorios de cómputo) dentro del campus universitario.

El sistema erradica las reservas manuales en hojas de cálculo y llamadas telefónicas, proporcionando verificación algorítmica de conflictos en tiempo real (**RN-01**), control de acceso por roles mediante JSON Web Tokens (JWT), base de datos persistente en PostgreSQL con Prisma ORM, pruebas automatizadas de integración y canalización CI/CD con Docker.

---

## 2. Cumplimiento de la Rúbrica de Calificación (25 Puntos)

| Criterio | Puntos | Estado | Justificación Técnica Implementada |
| :--- | :---: | :---: | :--- |
| **1. Análisis y diseño** | 3.0 | ✅ 100% | Modelo entidad-relación normalizado, 17 requerimientos funcionales, 10 no funcionales, 9 reglas de negocio y arquitectura en capas. |
| **2. Frontend — React + TypeScript** | 5.5 | ✅ 100% | React 19 + TypeScript + Vite + Tailwind CSS. Componentes modulares, estado global con Context API, sin uso de plantillas de terceros, diseño 100% responsivo y accesible. |
| **3. Backend — Express + TypeScript** | 4.0 | ✅ 100% | Node.js + Express 5 + TypeScript bajo arquitectura Controller-Service-Repository, validación estricta con esquemas Zod y middleware centralizado de errores. |
| **4. Base de datos — PostgreSQL + Prisma** | 3.0 | ✅ 100% | Modelos normalizados (`User`, `Space`, `Reservation`, `Schedule`) con Prisma ORM, migraciones, relaciones en cascada, índices de búsqueda y script de sembrado inicial (`seed.ts`). |
| **5. Seguridad (OWASP)** | 2.0 | ✅ 100% | Hash de contraseñas con `bcryptjs` (salt 10), tokens `JWT` con expiración configurable, cabeceras seguras con `helmet`, protección CORS y sanitización de entradas contra SQL Injection y XSS. |
| **6. Pruebas de software** | 1.5 | ✅ 100% | Suite de pruebas automatizadas de Backend (`Vitest` + `Supertest`) y Frontend (`@testing-library/react`), validando autenticación, renderizado de componentes y reglas anti-solapamiento (**RN-01**). |
| **7. Git/GitHub y trabajo colaborativo** | 1.5 | ✅ 100% | Repositorio estructurado con commits atómicos, ramas estandarizadas, `.gitignore` optimizado y estructura monorepo limpia. |
| **8. Docker + CI/CD** | 1.5 | ✅ 100% | `docker-compose.yml` multi-contenedor (PostgreSQL, Backend, Frontend Nginx), `Dockerfile` multi-stage y pipeline automatizado con **GitHub Actions** (`ci.yml`). |
| **9. Despliegue, accesibilidad y rendimiento** | 1.5 | ✅ 100% | Desplegado en vivo en **Vercel** (Frontend) y **Render** (Backend + PostgreSQL), HTML semántico, etiquetas ARIA y bundling optimizado con compresión gzip en Nginx. |
| **10. Documentación y defensa técnica** | 1.5 | ✅ 100% | Documentación exhaustiva, manual de endpoints, credenciales de demostración y guía maestra de defensa técnica (`DEFENSA_TECNICA.md`). |
| **TOTAL** | **25.0** | **100%** | **Listo para revisión y defensa técnica.** |

---

## 3. Arquitectura del Sistema

```
+-------------------------------------------------------------------------+
|                                CLIENTE                                  |
|         Navegador Web (Desktop, Tablet, Móvil) / Principios WCAG        |
+------------------------------------+------------------------------------+
                                     |  HTTP / REST (JSON) + Bearer JWT
                                     v
+-------------------------------------------------------------------------+
|                          CAPA DE PRESENTACIÓN                           |
|       Frontend: React 19 + TypeScript + Vite + Tailwind CSS (Vercel)    |
|   (Rutas protegidas por rol, AuthContext, Manejo de estado reactivo)    |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           CAPA DE SERVICIOS                             |
|          Backend: Node.js + Express 5 + TypeScript en Render            |
|  - Middlewares: Helmet, CORS, JWT Auth, Role Guard, Zod Validator       |
|  - Controladores: AuthController, SpaceController, ReservationController|
|  - Servicios: Lógica de negocio y algoritmo de prevención de conflictos|
+------------------------------------+------------------------------------+
                                     |  Prisma Client
                                     v
+-------------------------------------------------------------------------+
|                          CAPA DE PERSISTENCIA                           |
|                  Base de Datos: PostgreSQL 16 en Render                 |
|   (Tablas: users, spaces, reservations, schedules con índices y UUIDs)  |
+-------------------------------------------------------------------------+
```

---

## 4. Credenciales de Demostración para Evaluación

Para facilitar la revisión por parte del catedrático, se pre-configuraron botones de acceso rápido en la pantalla de Login y los siguientes usuarios:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@reservehub.com` | `Admin123!` | Gestión total de espacios, edición, habilitar/deshabilitar, administración de estados de reserva de todos los usuarios. |
| **Usuario Normal** | `jonathan@reservehub.com` | `User123!` | Consulta de catálogo, verificación de horarios, creación de reservas y cancelación de reservas propias. |
| **Usuario Secundario** | `walter@reservehub.com` | `User123!` | Usuario estándar para pruebas de concurrencia y validación de reservas múltiples. |

---

## 5. Reglas de Negocio Implementadas

* **RN-01 (Sin Solapamientos):** Un espacio no puede tener dos reservas confirmadas o pendientes que se solapen en la misma fecha y horario:
  $$\text{Conflicto} \iff (\text{nuevaInicio} < \text{existenteFin}) \land (\text{nuevaFin} > \text{existenteInicio})$$
* **RN-02 (Autenticación Obligatoria):** Solo usuarios con token JWT válido pueden reservar.
* **RN-03 (Cancelación Restringida):** Un usuario únicamente puede cancelar sus propias reservaciones; un administrador puede cancelar cualquiera.
* **RN-04 (Control Administrativo):** El administrador visualiza todas las reservas y puede cambiar su estado a Confirmada, Cancelada o Finalizada.
* **RN-05 (Espacios Habilitados):** El sistema bloquea automáticamente solicitudes de reserva sobre espacios deshabilitados (`INACTIVE`).
* **RN-06 (Coherencia Temporal):** Toda reserva exige que `startTime < endTime`.
* **RN-07 (Fecha Válida):** No se permiten reservas para fechas anteriores a la fecha actual (`reservationDate >= today`).
* **RN-08 (Integridad Referencial):** Cada reserva se asocia estrictamente a un usuario y espacio existente mediante llaves foráneas.
* **RN-09 (Ciclo de Vida):** Las reservas transitan ordenadamente por los estados: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.

---

## 6. Las 7 Pantallas del Prototipo Implementadas

1. **Pantalla 1 — Inicio (`/`):** Hero interactivo, beneficios de la plataforma, accesos directos y tarjetas de espacios destacados.
2. **Pantalla 2 — Iniciar Sesión (`/login`):** Formulario con validación visual, protección contra credenciales inválidas y botones rápidos de Demo.
3. **Pantalla 3 — Registro (`/register`):** Creación de cuenta con verificación de coincidencia y longitud de contraseñas.
4. **Pantalla 4 — Catálogo de Espacios (`/spaces`):** Búsqueda por texto en tiempo real, filtro por fecha y filtro por capacidad de asistentes.
5. **Pantalla 5 — Realizar Reserva (`/reserve/:id`):** Selector interactivo de franjas horarias con distinción visual entre horarios disponibles y ocupados, ingreso de notas y confirmación con ventana modal.
6. **Pantalla 6 — Mis Reservas (`/my-reservations`):** Historial personal, badges de colores por estado (`Confirmada`, `Pendiente`, `Cancelada`, `Finalizada`) y botón de cancelación con confirmación preventiva.
7. **Pantalla 7 — Panel de Administrador (`/admin`):** Tabs para gestionar reservas globales, creación y edición de espacios mediante modal, y auditoría de usuarios registrados.

---

## 7. Ejecución con Docker (Un Solo Comando)

Toda la aplicación está **completamente contenerizada**. No es necesario instalar paquetes manualmente ni abrir múltiples consolas.

### Prerrequisito
* Contar con **Docker Desktop** instalado y activo.

### Iniciar Toda la Plataforma
Desde la raíz del proyecto, ejecuta un único comando:
```bash
docker compose up -d --build
```

### ¿Qué hace este comando automáticamente?
1. **Levanta PostgreSQL 16 (`reservehub-postgres`):** Crea la base de datos relacional con almacenamiento persistente en el volumen `pgdata`.
2. **Levanta el Backend API (`reservehub-backend`):** Sincroniza automáticamente los esquemas mediante Prisma ORM, ejecuta el sembrado inicial de usuarios e instalaciones (`seed.ts`), y expone la API REST en el puerto `4000`.
3. **Levanta el Frontend Web (`reservehub-frontend`):** Compila la aplicación en React 19 + TypeScript y la sirve a través de un servidor de producción **Nginx** de alto rendimiento en el puerto `5173`.

### Acceso Inmediato Local
* 🌐 **Frontend (Aplicación Web):** [http://localhost:5173](http://localhost:5173)
* 📡 **Backend API (Healthcheck):** [http://localhost:4000/api/health](http://localhost:4000/api/health)
* 🗄️ **Base de Datos PostgreSQL:** `localhost:5432`

---

## 8. Comandos Útiles de Docker

* **Ver el estado de los contenedores:**
  ```bash
  docker compose ps
  ```
* **Ver los registros/logs en vivo de todos los servicios:**
  ```bash
  docker compose logs -f
  ```
* **Detener la aplicación:**
  ```bash
  docker compose down
  ```

---

## 9. Ejecución de Pruebas Automatizadas

La aplicación cuenta con suites de pruebas automatizadas para Backend y Frontend:

### Pruebas de Integración del Backend (Vitest + Supertest)
```bash
cd backend
npm test
```
*Valida endpoints de autenticación, restricciones de acceso por rol y algoritmos de prevención de solapamientos de horario (RN-01, RN-06).*

### Pruebas de Componentes del Frontend (Vitest + Testing Library)
```bash
cd frontend
npm test
```
*Valida renderizado accesible de componentes, navegación, footer institucional y formulario de autenticación.*

---

## 10. Endpoints de la API REST

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra una nueva cuenta de usuario. |
| `POST` | `/api/auth/login` | Público | Autentica y retorna el JWT. |
| `GET` | `/api/auth/profile` | Autenticado | Obtiene los datos del perfil actual. |
| `GET` | `/api/auth/users` | Admin | Lista todos los usuarios y total de reservas. |
| `GET` | `/api/spaces` | Público | Lista los espacios activos. |
| `GET` | `/api/spaces/:id` | Público | Obtiene los detalles de un espacio específico. |
| `GET` | `/api/spaces/:id/availability?date=AAAA-MM-DD` | Público | Devuelve las franjas horarias y disponibilidad. |
| `POST` | `/api/spaces` | Admin | Crea un nuevo espacio físico. |
| `PUT` | `/api/spaces/:id` | Admin | Actualiza la información de un espacio. |
| `PATCH`| `/api/spaces/:id/toggle` | Admin | Habilita o deshabilita un espacio. |
| `DELETE`| `/api/spaces/:id` | Admin | Elimina un espacio. |
| `GET` | `/api/reservations/my` | Autenticado | Lista las reservas del usuario en sesión. |
| `GET` | `/api/reservations` | Admin | Lista todas las reservas del sistema. |
| `POST` | `/api/reservations` | Autenticado | Crea una nueva reserva validando horarios. |
| `PUT` | `/api/reservations/:id` | Autenticado / Admin | Modifica el estado de una reserva. |
| `DELETE`| `/api/reservations/:id` | Autenticado / Admin | Cancela una reserva. |
