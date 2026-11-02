# ReserveHub — Guía Maestra para la Defensa Técnica del Proyecto

Este documento está diseñado para que cualquiera de los integrantes del equipo (**Jonathan García, Walter Herrera, Boris Garzona, Samuel Ruiz, Giancarlo Ortega, Mario López**) demuestre **dominio total y riguroso** de la aplicación ante el Ing. Ronald Ayala.

---

## 1. Arquitectura y Decisiones de Diseño

### Pregunta: *¿Por qué eligieron una arquitectura desacoplada Frontend + Backend + Base de Datos?*
**Respuesta:**
* **Separación de responsabilidades (SoC):** El Frontend (React 19 + TypeScript) se enfoca exclusivamente en la experiencia de usuario y estado visual, comunicándose mediante una API REST estándar en formato JSON con el Backend (Express 5 + TypeScript).
* **Escalabilidad y Mantenibilidad:** Permite que el backend pueda ser consumido en el futuro por una app móvil o servicios externos sin tocar la lógica de negocio.
* **Seguridad:** El frontend nunca se conecta directamente a la base de datos ni expone credenciales maestras; todo pasa por middlewares de autenticación (JWT) y validación (Zod).

---

## 2. Base de Datos y ORM (PostgreSQL + Prisma)

### Pregunta: *¿Cómo está estructurado el modelo de datos y por qué usaron Prisma ORM?*
**Respuesta:**
* **Modelos:**
  1. `users`: Almacena credenciales con rol `ADMIN` o `USER`. Contraseña cifrada con hash bcrypt.
  2. `spaces`: Salones, auditorios y laboratorios con atributos de capacidad, ubicación y estado (`ACTIVE`/`INACTIVE`).
  3. `schedules`: Horarios de apertura y cierre de cada espacio por día de la semana (0=Domingo, ..., 6=Sábado).
  4. `reservations`: Reservas vinculadas por llaves foráneas a `userId` y `spaceId` con fecha (`YYYY-MM-DD`), hora inicio (`HH:mm`), hora fin (`HH:mm`) y estado (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
* **Ventajas de Prisma:**
  * **Tipado estático de extremo a extremo:** TypeScript detecta automáticamente si intentamos consultar un campo inexistente en tiempo de compilación.
  * **Prevención nativa de SQL Injection:** Prisma utiliza consultas preparadas (*parameterized queries*).
  * **Integridad referencial:** Configuramos borrado y actualización en cascada (`onDelete: Cascade`) e índices compuestos en `[spaceId, reservationDate]` para optimizar búsquedas.

---

## 3. Lógica Crítica de Negocio: Prevención de Conflictos de Horario (RN-01)

### Pregunta: *¿Cómo evitan matemáticamente que existan dos reservas solapadas para el mismo espacio?*
**Respuesta:**
En `backend/src/services/reservationService.ts`, antes de guardar una reserva, ejecutamos la consulta:
```typescript
const existingConflicts = await prisma.reservation.findMany({
  where: {
    spaceId: data.spaceId,
    reservationDate: data.reservationDate,
    status: { in: ['CONFIRMED', 'PENDING'] },
    AND: [
      { startTime: { lt: data.endTime } },
      { endTime: { gt: data.startTime } },
    ],
  },
});
```
* **Fórmula de Intervalos Abiertos/Semi-abiertos:**
  $$\text{Existe Solapamiento} \iff (\text{nuevaInicio} < \text{existenteFin}) \land (\text{nuevaFin} > \text{existenteInicio})$$
* Si `existingConflicts.length > 0`, se rechaza con error **HTTP 409 Conflict** y mensaje descriptivo.
* Además, la regla **RN-06** asegura que `startTime < endTime` mediante validación en el esquema Zod (`.refine()`).
* La regla **RN-07** impide reservar en fechas pasadas comparando con la fecha actual del sistema.

---

## 4. Seguridad basada en OWASP (RNF-03, RNF-04, RNF-05)

### Pregunta: *¿Qué medidas de seguridad implementaron?*
**Respuesta:**
1. **Almacenamiento seguro de credenciales (A02 - Cryptographic Failures):**
   * Las contraseñas nunca se guardan en texto plano. Se utiliza `bcryptjs` con factor de coste de **10 rondas de salt**.
2. **Autenticación sin estado (Stateless Auth con JWT):**
   * Tokens firmados con algoritmo HMAC SHA-256 (`jsonwebtoken`) y clave secreta en variable de entorno. Los tokens viajan en el header `Authorization: Bearer <token>` y expiran automáticamente.
3. **Control de Acceso Basado en Roles (RBAC - A01 Broken Access Control):**
   * Middleware `requireAdmin` que bloquea rutas de creación de espacios y consulta global de reservas si el token no tiene `role === 'ADMIN'`.
4. **Cabeceras HTTP Seguras:**
   * Uso de `helmet` para configurar `Content-Security-Policy`, `X-Content-Type-Options: nosniff` y `X-Frame-Options: SAMEORIGIN` contra clickjacking.
5. **Validación de Entradas (A03 - Injection):**
   * Todos los payloads pasan por esquemas **Zod** antes de ser procesados por los controladores. Datos maliciosos o mal formateados son rechazados con **HTTP 400**.

---

## 5. Pruebas Automatizadas (Testing)

### Pregunta: *¿Cómo probaron la aplicación?*
**Respuesta:**
* **Backend:** Implementamos pruebas de integración con **Vitest** y **Supertest** en `backend/tests/api.test.ts`. Probamos:
  * Healthcheck endpoint.
  * Flujo de Login y rechazo ante contraseñas incorrectas (401).
  * Catálogo de espacios.
  * Protección de rutas privadas sin token.
  * Rechazo de reservas inválidas donde la hora de inicio supera a la de fin (RN-06).
* **Frontend:** Pruebas de componentes con **Vitest + Testing Library + jsdom** en `frontend/src/tests/App.test.tsx`, verificando el renderizado correcto del Navbar, navegación y Footer institucional.

---

## 6. Docker y CI/CD

### Pregunta: *¿Cómo está contenerizado el sistema y cómo funciona el CI/CD?*
**Respuesta:**
* **Docker Multi-Stage:**
  * Backend: Compila TypeScript en etapa builder y corre solo con dependencias de producción en node:22-alpine.
  * Frontend: Compila assets con Vite y los sirve mediante **Nginx Alpine**, con compresión gzip y fallback para Single Page Application (`try_files $uri $uri/ /index.html`).
* **Docker Compose:** Orquesta el contenedor de base de datos PostgreSQL 16 con volumen persistente (`pgdata`), backend y frontend.
* **CI/CD:** En `.github/workflows/ci.yml`, cada `git push` a `main` levanta una base de datos PostgreSQL de prueba en GitHub Actions, ejecuta migraciones, compila TypeScript y corre los tests de backend y frontend automáticamente.
