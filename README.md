<div align="center">

<img src="public/images/logo.png" alt="Logo BiblioTech" width="90" height="90">

# 📚 BiblioTech

**Sistema de gestión para bibliotecas barriales**  
Catálogo, préstamos, reservas, multas y reportes — todo en un solo lugar.

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sanctum](https://img.shields.io/badge/Auth-Sanctum-3178C6?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📖 Sobre el proyecto

**BiblioTech** es una API REST construida con **Laravel 12** para administrar una biblioteca barrial, con un frontend liviano en HTML/CSS/JS (Bootstrap 5) que consume esa API. Contempla tres roles de usuario (**administrador**, **bibliotecario** y **socio**) y cubre todo el ciclo de vida de una biblioteca: alta de libros y ejemplares, préstamos, devoluciones, reservas, multas por atraso y reportes de uso.

## ✨ Funcionalidades principales

| Módulo | Descripción |
|---|---|
| 📕 **Catálogo** | Alta, edición y baja de libros y categorías, con portada e ISBN. Consultable sin necesidad de iniciar sesión. |
| 🔖 **Ejemplares** | Cada libro puede tener varios ejemplares físicos, con estado propio (disponible, prestado, etc.). |
| 🔄 **Préstamos** | Registro, devolución, renovación y anulación de préstamos. |
| ⏰ **Reservas** | Un socio reserva un ejemplar y el bibliotecario confirma la entrega. |
| 💸 **Multas** | Gestión de sanciones por atrasos en la devolución. |
| 🔔 **Notificaciones** | Avisos a los socios sobre el estado de sus préstamos/reservas. |
| 🧑‍🤝‍🧑 **Socios y personal** | Administración de socios, bibliotecarios y usuarios del sistema, con verificación de centro educativo. |
| 📊 **Reportes** | Préstamos por período, libros más prestados, socios con atrasos y disponibilidad del catálogo. |

## 🔐 Roles y permisos

| Rol | Puede... |
|---|---|
| **Invitado** | Consultar el catálogo (libros, categorías, ejemplares) sin iniciar sesión. |
| **Socio** | Además de lo anterior: reservar/cancelar sus propias reservas y ver sus notificaciones. |
| **Bibliotecario** | Gestionar socios, ejemplares, préstamos, multas, confirmar reservas y ver reportes. |
| **Administrador** | Todo lo anterior + gestión del catálogo (libros/categorías) y de cuentas de usuario/bibliotecarios. |

## 🛠️ Stack técnico

- **Backend:** Laravel 12 · PHP 8.2+ · Laravel Sanctum (autenticación por token)
- **Base de datos:** MySQL 8.0
- **Frontend:** HTML + CSS + JavaScript (vanilla) · Bootstrap 5 · Font Awesome
- **Infraestructura:** Docker Compose (app + Nginx + MySQL + phpMyAdmin)

## 📂 Estructura del proyecto

```
BiblioTech/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # Controladores de la API (Libros, Prestamos, Reservas, etc.)
│   │   └── Middleware/        # CheckRole: control de acceso por rol
│   └── Models/                # Usuario, Socio, Bibliotecario, Libro, Ejemplar, Prestamo, Reserva, Multa...
├── database/
│   ├── migrations/            # Esquema de la base de datos
│   └── seeders/                # Roles base + usuario administrador inicial
├── routes/
│   └── api.php                 # Rutas públicas, de socio y de gestión (admin/bibliotecario)
├── public/                     # Frontend (index.html, style.css, script.js, api.js)
├── docker/                     # Configuración de Nginx para el contenedor
├── docker-compose.yml          # Orquestación: app, nginx, db, phpmyadmin
└── Dockerfile
```

## 🚀 Puesta en marcha

### Opción A — Con Docker (recomendada)

1. Clonar el repositorio y ubicarse en la carpeta del proyecto.
2. Crear el archivo `.env` (podés partir de `.env.docker.example` para el `UID`/`GID`, y completar el resto según tu entorno local: base de datos, `APP_URL`, etc.).
3. Levantar los contenedores:
   ```bash
   docker compose up -d --build
   ```
4. Instalar dependencias y preparar la base de datos dentro del contenedor `app`:
   ```bash
   docker compose exec app composer install
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan migrate --seed
   ```
5. Abrir la aplicación:
   - 🌐 App / API: **http://localhost:8000**
   - 🗄️ phpMyAdmin: **http://localhost:8080**

### Opción B — Entorno local (sin Docker)

```bash
composer install
cp .env.example .env      # completar datos de conexión a tu MySQL local
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

La app quedará disponible en **http://localhost:8000**.

### 👤 Usuario administrador inicial

El seeder crea automáticamente los tres roles y una cuenta de administrador:

| Campo | Valor |
|---|---|
| Email | `admin@biblioteca.local` |
| Contraseña | `cambiar123` |

> ⚠️ Cambiá esta contraseña apenas tengas el sistema en marcha.

## 🔌 API

Las rutas viven bajo `/api`. Un resumen de los grupos principales:

- **Públicas:** `POST /api/auth/login`, `POST /api/auth/registro`, `GET /api/libros`, `GET /api/categorias`, `GET /api/ejemplares`.
- **Autenticadas (socio):** `/api/auth/me`, `/api/reservas`, `/api/notificaciones`.
- **Gestión (bibliotecario/administrador):** `/api/socios`, `/api/prestamos`, `/api/multas`, `/api/ejemplares` (alta/edición), confirmación de reservas, `/api/reportes/*`.
- **Solo administrador:** alta/edición/baja de `/api/libros`, `/api/categorias`, `/api/usuarios` y `/api/bibliotecarios`.

La autenticación se maneja con **Laravel Sanctum** vía token: iniciá sesión en `/api/auth/login` y enviá el token recibido en el header `Authorization: Bearer <token>` en las siguientes peticiones.

## 🖥️ Frontend

El frontend en `public/` es una página estática que consume la API. La URL del backend se calcula automáticamente a partir de `window.location.origin`, por lo que funciona tanto en `localhost` como accediendo desde otro dispositivo en la misma red, sin tocar código.

---

<div align="center">
<sub>Proyecto académico — Biblioteca Barrial</sub>
</div>
