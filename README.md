# BiblioTech


Página web simple para gestionar una pequeña biblioteca. Permite ver libros, filtrarlos por categoría y agregar nuevos libros de forma manual, todo con **HTML, CSS y JavaScript puro** (sin frameworks ni dependencias).

## Vista previa

Una página con encabezado, formulario para agregar libros, filtro por categoría y una lista de libros disponibles.

## Características

- 📖 Lista de libros con título, autor y categoría
- ➕ Formulario para agregar libros manualmente
- 🏷️ Filtro por categoría (Novela, Ciencia ficción, Infantil, Poesía, Otro)
- 🎨 Diseño simple y responsivo

## Estructura del proyecto

- `index.html` — Estructura de la página
- `style.css` — Estilos
- `script.js` — Lógica para agregar y filtrar libros
- `README.md` — Este archivo

## Uso

1. Descarga o clona este repositorio.
2. Abre el archivo `index.html` en tu navegador.
3. Usa el formulario para agregar libros y el filtro para explorar por categoría.

No requiere instalación ni servidor: es una página estática que funciona abriendo el archivo directamente.

## Notas

- Los libros agregados se guardan solo en memoria durante la sesión. Al recargar la página, la lista vuelve a su estado inicial.
- Para persistencia de datos (que los libros no se pierdan al recargar), se podría integrar `localStorage` o una base de datos externa.

## Posibles mejoras futuras

- [ ] Guardar los libros de forma permanente
- [ ] Botón para eliminar o editar libros
- [ ] Buscador por título o autor
- [ ] Portadas de libros

## Licencia

Este proyecto es de uso libre para fines educativos y personales.