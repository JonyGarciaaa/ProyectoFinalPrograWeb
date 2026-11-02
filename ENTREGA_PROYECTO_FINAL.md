# UNIVERSIDAD RAFAEL LANDÍVAR
## FACULTAD DE INGENIERÍA
### INGENIERÍA EN INFORMÁTICA Y SISTEMAS
### CURSO: PROGRAMACIÓN WEB
**Catedrático:** Ing. Ronald Leonel Ayala Garrido  
**Ciclo:** Segundo Semestre 2026  
**Fecha de Entrega:** 5 de noviembre de 2026  

---

# PROYECTO FINAL: APLICACIÓN WEB FUNCIONAL
## ReserveHub — Sistema Web de Reservas de Espacios Universitarios

---

### Integrantes del Equipo

| Nombre Completo | No. Carné | Rol Principal |
| :--- | :---: | :--- |
| **Walter José Herrera Salvatierra** | 1109722 | Arquitectura Backend y Base de Datos |
| **Boris Garzona** | 1218122 | Lógica de Negocio y Pruebas Automatizadas |
| **Jonathan García** | 1045222 | Frontend React, Integración y Despliegue |
| **Samuel Ruiz** | 1228722 | Seguridad OWASP y Contenerización Docker |
| **Giancarlo Ortega** | 1230222 | Diseño Responsivo UI/UX y Accesibilidad |
| **Mario López** | 2477123 | Pipeline CI/CD y Documentación Técnica |

---

## 🌐 1. Enlaces Oficiales del Proyecto para Calificación

| Recurso | Plataforma | Enlace Público | Descripción |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | **Vercel** | [https://proyecto-final-progra-web-theta.vercel.app](https://proyecto-final-progra-web-theta.vercel.app) | Aplicación web interactiva en producción (React 19 + TypeScript + Vite + Tailwind CSS). |
| **Backend API** | **Render** | [https://reservehub-backend-881f.onrender.com/api/health](https://reservehub-backend-881f.onrender.com/api/health) | API REST en la nube con Node.js, Express y TypeScript. |
| **Base de Datos** | **Render PostgreSQL** | Conectada con Prisma ORM | Instancia PostgreSQL 16 persistente en la nube. |
| **Repositorio GitHub** | **GitHub** | [https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb](https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb) | Código fuente completo, historial de commits y flujos de CI/CD. |
| **Pipeline CI/CD** | **GitHub Actions** | [Ver Ejecuciones en Verde](https://github.com/JonyGarciaaa/ProyectoFinalPrograWeb/actions) | Pruebas y compilaciones automatizadas pasando al 100%. |

---

## 🔑 2. Credenciales de Acceso para Evaluación (Catedrático y Auxiliar)

Para agilizar la calificación, la pantalla de **Iniciar Sesión** (`/login`) cuenta con botones de acceso directo demo (*Admin Demo* y *Usuario Demo*). También se pueden ingresar manualmente las siguientes credenciales:

| Rol | Correo Electrónico | Contraseña | Capacidades en la Plataforma |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@reservehub.com` | `Admin123!` | Acceso completo al Panel de Administrador (`/admin`). Crear, editar y deshabilitar espacios físicos; visualizar todas las reservas de la universidad; cambiar estados de reserva (Confirmar, Cancelar, Finalizar); auditar usuarios registrados. |
| **Usuario Estudiante** | `jonathan@reservehub.com` | `User123!` | Explorar catálogo de espacios, verificar franjas horarias disponibles en tiempo real, crear reservaciones sin conflicto de horario y cancelar sus propias reservas activas (`/my-reservations`). |
| **Usuario Alternativo** | `walter@reservehub.com` | `User123!` | Usuario adicional para pruebas concurrentes y validación de reglas anti-solapamiento (**RN-01**). |

---

## 3. Resumen Ejecutivo de la Solución

**ReserveHub** es una solución integral desarrollada para modernizar la gestión y préstamo de aulas ejecutivas, salones de conferencias, auditorios y laboratorios de la Universidad Rafael Landívar.

### Arquitectura Técnica
* **Frontend:** Desarrollado con **React 19**, **TypeScript** y **Vite**, estilizado con **Tailwind CSS** bajo principios de diseño responsivo y sin uso de plantillas prediseñadas. Cumple con principios de accesibilidad WCAG y navegación adaptativa.
* **Backend:** API REST construida sobre **Node.js** y **Express 5** en **TypeScript**, estructurada bajo el patrón Controller-Service-Repository.
* **Persistencia:** Base de datos relacional **PostgreSQL 16** gestionada mediante **Prisma ORM**, con modelos normalizados (`users`, `spaces`, `reservations`, `schedules`), índices optimizados y borrado en cascada.
* **Seguridad (OWASP):** Cifrado irreversible de contraseñas con `bcryptjs` (salt 10), autenticación sin estado mediante `JWT` con expiración automática, control de acceso basado en roles (RBAC), cabeceras HTTP seguras con `helmet`, protección CORS estricta y validación de datos de entrada con esquemas `Zod`.
* **Pruebas Automatizadas:** Cobertura de pruebas de integración en el Backend con `Vitest` y `Supertest`, y pruebas de renderizado de componentes en el Frontend con `@testing-library/react`.
* **DevOps & Despliegue:** Contenerización multi-servicio con **Docker** y **Docker Compose**, pipeline de integración continua con **GitHub Actions**, y despliegue en producción en **Vercel** y **Render**.

---

## 4. Matriz de Cumplimiento de la Rúbrica (25 / 25 Puntos)

| Criterio | Puntos | Justificación Técnica Implementada |
| :--- | :---: | :--- |
| **1. Análisis y diseño** | **3.0** | Documento de análisis formalizado con 17 requerimientos funcionales (RF-01 a RF-17), 10 no funcionales (RNF-01 a RNF-10), 9 reglas de negocio (RN-01 a RN-09), modelo relacional normalizado y prototipos de interfaz. |
| **2. Frontend — React + TypeScript** | **5.5** | 7 pantallas prototipadas funcionales: Inicio, Login, Registro, Catálogo con filtros reactivos, Reserva con slots interactivos, Mis Reservas con badges y Panel de Administrador con tabs y modales. Componentes modulares y Context API. |
| **3. Backend — Express + TypeScript** | **4.0** | API REST completa con tipado estricto, middlewares de autenticación, validación con esquemas Zod en `req.body` y `req.query`, y middleware centralizado de excepciones con respuestas JSON estandarizadas. |
| **4. Base de datos — PostgreSQL + Prisma** | **3.0** | Modelos `User`, `Space`, `Reservation`, `Schedule` con llaves foráneas, índices de búsqueda, migraciones declarativas y script de sembrado inicial (`seed.ts`) que pre-carga usuarios y salones. |
| **5. Seguridad** | **2.0** | Hash bcrypt, tokens JWT en cabeceras `Bearer`, roles `ADMIN` y `USER`, prevención de SQL Injection mediante consultas parametrizadas de Prisma y mitigación de XSS/Clickjacking con Helmet. |
| **6. Pruebas de software** | **1.5** | Suite de pruebas unitarias y de integración pasando al 100%: backend (`tests/api.test.ts`) probando endpoints y algoritmos de conflicto; frontend (`tests/App.test.tsx`) probando componentes. |
| **7. Git/GitHub y trabajo colaborativo** | **1.5** | Repositorio estructurado con historial de commits limpios, convenciones semánticas, ramas de trabajo, archivo `.gitignore` estandarizado y sincronización remota continua. |
| **8. Docker + CI/CD** | **1.5** | `docker-compose.yml` multiserver (Postgres, Backend Express, Frontend Nginx). Pipeline automatizado en GitHub Actions (`.github/workflows/ci.yml`) que compila, migra y prueba en cada push. |
| **9. Despliegue, accesibilidad y rendimiento** | **1.5** | Despliegue público en producción activo en **Vercel** y **Render**. Diseño responsivo (móvil, tablet, desktop), etiquetas ARIA de accesibilidad y Nginx con compresión gzip. |
| **10. Documentación y defensa técnica** | **1.5** | `README.md` exhaustivo con manual de endpoints y comandos Docker de un solo paso, acompañado de la guía de preguntas y respuestas `DEFENSA_TECNICA.md`. |
| **TOTAL** | **25.0** | **PROYECTO COMPLETO Y LISTO PARA EVALUACIÓN** |

---

## 5. Instrucciones de Ejecución Local con Docker (Opción de Evaluación Local)

En caso de que el catedrático solicite la demostración en vivo en entorno local contenerizado:

### Requisito:
Tener abierto **Docker Desktop**.

### Comando de Arranque Único:
Desde la raíz del proyecto clonado:
```bash
docker compose up -d --build
```
*Este comando orquesta automáticamente la base de datos PostgreSQL, ejecuta las migraciones, realiza el sembrado de datos y levanta el backend (puerto 4000) y el frontend servido por Nginx (puerto 5173) sin necesidad de ejecutar comandos manuales adicionales.*

### Acceso Local Inmediato:
* **Frontend Web:** [http://localhost:5173](http://localhost:5173)
* **Backend Healthcheck:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
