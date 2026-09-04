# BiblioTech

**BiblioTech** es una aplicación web para gestionar una pequeña biblioteca desde el navegador. Permite administrar el catálogo de libros, reservas, préstamos y devoluciones, socios, multas, reportes e historial de actividad.

El proyecto está desarrollado con **HTML, CSS y JavaScript**, utilizando **Bootstrap 5** y **Font Awesome** desde CDN. Los datos se almacenan localmente en el navegador mediante `localStorage`, por lo que no requiere una base de datos ni un backend para funcionar.

## Funcionalidades

### 📚 Catálogo de libros
- Visualización de libros en formato de catálogo.
- Libros iniciales de ejemplo: *Cien años de soledad*, *1984*, *El principito* y *Rayuela*.
- Búsqueda por título o autor.
- Filtrado por categoría.
- Categorías predeterminadas: **Novela, Ciencia ficción, Infantil y Poesía**.
- Creación de categorías personalizadas mediante **Otro**.
- Alta, edición y eliminación de libros.
- Registro opcional de código de barras / ISBN.
- Consulta de libros mediante **Google Books API** a partir del ISBN.
- Búsqueda automática de portadas mediante **Google Books** y, como alternativa, **Open Library**.
- Posibilidad de seleccionar una portada desde un archivo local.

### 📖 Reservas
- Registro y cancelación de reservas.
- Identificación del solicitante y tipo de usuario.
- Los usuarios **Particulares** pueden tener una sola reserva activa.
- Los **Centros educativos** pueden reservar varios libros.
- Conversión de una reserva en préstamo.

### 🔄 Préstamos y devoluciones
- Registro de préstamos y devoluciones.
- Fecha automática del préstamo.
- Plazo de préstamo de **14 días**.
- Estados: **Disponible, Reservado y Prestado**.
- Filtro por **Todos, En curso y Devueltos**.
- Detección de préstamos vencidos.

### 👥 Socios
- Registro de socios.
- Tipos: **Particular** y **Centro educativo**.
- Estados: **Activo** y **Suspendido**.
- Cambio de estado y eliminación.
- Autocompletado de nombres en formularios.

### 💰 Multas
- Registro de multas asociadas a un socio.
- Motivos: atraso en devolución, libro perdido o libro deteriorado.
- Registro de monto y fecha.
- Estados **Pendiente** y **Pagada**.
- Marcar multas como pagadas o eliminarlas.

### 📊 Reportes e historial
La sección **Reportes** muestra:
- Total de libros.
- Libros disponibles, prestados y reservados.
- Préstamos atrasados.
- Los 5 libros más prestados.
- Préstamos vencidos.
- Historial de actividad reciente.

El historial conserva como máximo las últimas **50 actividades**.

### 🔐 Registro e inicio de sesión
- Creación de cuentas.
- Inicio y cierre de sesión.
- Validación de correo y contraseña.
- Contraseña mínima de 6 caracteres.
- Sesión persistente mediante `localStorage`.

> **Importante:** la autenticación es únicamente del lado del cliente. Las cuentas y contraseñas se almacenan en `localStorage`, por lo que no debe considerarse un sistema seguro para producción.

## Tecnologías utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Bootstrap 5.3.3**
- **Font Awesome 6.5.1**
- **Google Fonts**
- **Google Books API**
- **Open Library**
- **localStorage**

## Estructura del proyecto

```text
BiblioTech/
├── index.html
├── style.css
├── script.js
├── README.md
└── images/
    └── logo.png
```

- `index.html` — estructura de la interfaz, formularios, pestañas y modales.
- `style.css` — estilos, catálogo, estados, navegación y diseño responsive.
- `script.js` — lógica de libros, categorías, reservas, préstamos, socios, multas, reportes, historial y autenticación.
- `README.md` — documentación del proyecto.
- `images/logo.png` — logotipo utilizado en el encabezado.

## Almacenamiento de datos

La aplicación utiliza `localStorage` para conservar los datos entre recargas del navegador.

Claves utilizadas:

```text
biblioteca-libros
biblioteca-reservas
biblioteca-prestamos
biblioteca-categorias-personalizadas
biblioteca-socios
biblioteca-multas
biblioteca-historial
biblioteca-usuarios
biblioteca-sesion
```

No existe actualmente una base de datos centralizada.

## Cómo ejecutar

Se puede abrir `index.html` directamente en un navegador. Para un funcionamiento más consistente con las APIs externas, se recomienda utilizar un servidor local.

Por ejemplo:

```bash
python -m http.server 8000
```

Después acceder a:

```text
http://localhost:8000
```

## APIs externas

**Google Books API:** se utiliza para buscar libros mediante ISBN y obtener título, autores, categorías y portada.

**Open Library:** se utiliza como alternativa para encontrar portadas cuando Google Books no proporciona una imagen.

Estas funciones requieren conexión a Internet.

## Diseño

La interfaz incluye:
- Barra superior con acceso y autenticación.
- Encabezado de Biblioteca Central.
- Navegación por pestañas.
- Catálogo de libros mediante tarjetas.
- Formularios y ventanas modales.
- Indicadores visuales para estados.
- Diseño adaptable a dispositivos móviles.

## Estado actual

- [x] Catálogo de libros
- [x] Alta, edición y eliminación de libros
- [x] Búsqueda por título o autor
- [x] Filtro por categoría
- [x] Categorías personalizadas
- [x] Código de barras / ISBN
- [x] Consulta mediante Google Books
- [x] Portadas automáticas y locales
- [x] Reservas
- [x] Préstamos y devoluciones
- [x] Control de préstamos vencidos
- [x] Gestión de socios
- [x] Gestión de multas
- [x] Reportes
- [x] Historial de actividad
- [x] Registro e inicio de sesión
- [x] Persistencia mediante `localStorage`
- [x] Diseño responsive

## Limitaciones

- Los datos dependen del navegador y del almacenamiento local.
- No existe backend ni base de datos.
- La autenticación no es segura para producción.
- Las búsquedas y portadas dependen de servicios externos.
- Los datos pueden perderse al borrar los datos del sitio o cambiar de dispositivo.

## Posibles mejoras futuras

- Incorporar backend y base de datos.
- Implementar autenticación segura en servidor.
- Hashear contraseñas.
- Sincronizar información entre dispositivos.
- Agregar roles y permisos.
- Incorporar exportación de datos.
- Agregar estadísticas más avanzadas.
- Incorporar lectura de códigos de barras mediante cámara.
