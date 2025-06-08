# 🧩 Arquitectura General del Proyecto

Este proyecto está compuesto por **dos sistemas independientes pero conectados**: un **sistema administrativo (Admin System)** orientado a la gestión interna, y un **sistema de tienda (Store System)** dirigido al cliente final. Ambos se desarrollan principalmente en **TypeScript**, con la excepción del frontend del *Store System*, que utiliza JavaScript con **Vite + React**.

---

## 🔐 Admin System

Sistema destinado a la administración, control y análisis de productos, ventas y usuarios. Se compone de los siguientes módulos:

### 1. Frontend

* Desarrollado con **Next.js (App Router)** y **React**.
* Usa mayormente componentes de **Material UI (MUI)** y librerías de visualización como **chart.js** o similares.
* **Rutas protegidas**:

  * `/dashboard`
  * `/inventory`
  * `/sales`
  * `/analytics`
* **Rutas públicas**:

  * `/login`
  * `/unauthorized`
  * `/not-found`
* Funcionalidades destacadas:

  * **Dashboard** y **Analytics**: visualización mediante gráficos (actualmente con datos simulados).
  * **Inventory** y **Sales**: tablas con soporte para operaciones **CRUD** a través del backend.

### 2. API Gateway

* Implementado con **NestJS**.
* Encargado de recibir solicitudes HTTP del frontend y redirigirlas a los microservicios correspondientes mediante **gRPC**.

### 3. Microservicios

Desarrollados con **NestJS** y comunicación entre ellos mediante **gRPC**.

* **auth-service**

  * Maneja la autenticación mediante cookies con *accessToken*.
  * Realiza operaciones CRUD sobre usuarios y roles del sistema administrativo.
  * Base de datos: **MongoDB** (`auth_db -> admin_users`), utilizando **Mongoose**.

* **inventory-service**

  * Administra el catálogo de productos.
  * Realiza operaciones CRUD.
  * Base de datos: **PostgreSQL** (`inventory_db -> products`), utilizando **Prisma**.

* **sales-service**

  * Gestiona pedidos, ítems y contadores de órdenes.
  * Usa **Redis con Redlock** para aplicar bloqueo distribuido y evitar condiciones de carrera al procesar pedidos.
  * Al registrar una orden, actualiza remotamente el inventario mediante una solicitud gRPC al `inventory-service`.
  * Base de datos: **PostgreSQL** (`sales_db -> orders`, `order_items`, `counters`), con **Prisma**.

### 4. Infraestructura

* Bases de datos y servicios levantados con **Docker Compose**:

  * **MongoDB**
  * **PostgreSQL**
  * **Redis**

### 5. Futuras implementaciones

* Microservicio de **notificaciones**.
* Comunicación entre microservicios basada en eventos (**Pub/Sub con Redis**).
* Integración de **ELK Stack** para análisis de logs.
* **Dashboard con datos reales** provenientes de los microservicios.
* Soporte para **WebSockets** en tablas y gráficos para visualización en tiempo real.

---

## 🚀 Tecnologías Clave (Admin System, Store System)

* **Frontend**: React, Next.js, Vite, TailwindCSS, MUI, React-Bootstrap
* **Backend**: NestJS, gRPC, REST, Prisma, Mongoose
* **Bases de datos**: PostgreSQL, MongoDB, Redis
* **Infraestructura**: Docker, Docker Compose
* **Seguridad**: Cookies HttpOnly para tokens, rutas protegidas
* **Futuras mejoras**: Redis Pub/Sub, WebSockets, ELK Stack, datos en tiempo real
