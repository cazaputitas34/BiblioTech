// se guarda en localStorage para simular persistencia
// mientras no exista conexión con el backend.
const STORAGE_KEY = "biblioteca-libros";

const librosPorDefecto = [
  { id: crypto.randomUUID(), titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela" },
  { id: crypto.randomUUID(), titulo: "1984", autor: "George Orwell", categoria: "Ciencia ficción" },
  { id: crypto.randomUUID(), titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil" },
  { id: crypto.randomUUID(), titulo: "Rayuela", autor: "Julio Cortázar", categoria: "Novela" }
];

let libros = cargarLibros();

// cosas del DOM
const lista = document.getElementById("lista-libros");
const estadoVacio = document.getElementById("estado-vacio");
const contador = document.getElementById("contador-libros");
const form = document.getElementById("form-libro");
const inputBuscar = document.getElementById("buscar");
const filtroCategoria = document.getElementById("filtro-categoria");
const inputTitulo = document.getElementById("titulo");
const previewImg = document.getElementById("preview-portada-img");
const previewPlaceholder = document.getElementById("preview-portada-placeholder");
const previewLoading = document.getElementById("preview-portada-loading");

let portadaActual = null; // portada encontrada para el título que se está escribiendo
let debouncePortada = null;

function cargarLibros() {
  const guardados = localStorage.getItem(STORAGE_KEY);
  return guardados ? JSON.parse(guardados) : librosPorDefecto;
}

function guardarLibros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
}

function librosFiltrados() {
  const categoria = filtroCategoria.value;
  const texto = inputBuscar.value.trim().toLowerCase();

  return libros.filter(libro => {
    const coincideCategoria = categoria === "Todas" || libro.categoria === categoria;
    const coincideTexto =
      libro.titulo.toLowerCase().includes(texto) ||
      libro.autor.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });
}

function renderizarLibros() {
  const filtrados = librosFiltrados();

  lista.innerHTML = "";
  estadoVacio.classList.toggle("d-none", filtrados.length > 0);
  contador.textContent = `${libros.length} ${libros.length === 1 ? "libro" : "libros"}`;

  filtrados.forEach(libro => {
    const li = document.createElement("li");
    li.className = "libro-item";

    const portadaHtml = libro.portada
      ? `<img class="libro-portada" src="${libro.portada}" alt="Portada de ${escapeHtml(libro.titulo)}">`
      : `<div class="libro-portada"><i class="fa-solid fa-book"></i></div>`;

    li.innerHTML = `
      ${portadaHtml}
      <div class="libro-info flex-grow-1">
        <h3>${escapeHtml(libro.titulo)}</h3>
        <p>Autor: ${escapeHtml(libro.autor)}</p>
        <span class="etiqueta">${escapeHtml(libro.categoria)}</span>
      </div>
      <button class="btn-eliminar" title="Eliminar libro" data-id="${libro.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    lista.appendChild(li);
  });
}

// busca la portada de un libro en Open Library a partir del título (y autor, si se pasa)
async function buscarPortada(titulo, autor) {
  if (!titulo) return null;

  try {
    const params = new URLSearchParams({ title: titulo, limit: 1 });
    if (autor) params.set("author", autor);

    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
    if (!res.ok) return null;

    const data = await res.json();
    const doc = data.docs && data.docs[0];
    if (doc && doc.cover_i) {
      return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    }
    return null;
  } catch (err) {
    console.error("Error buscando portada en Open Library:", err);
    return null;
  }
}

function mostrarPreviewCargando() {
  previewImg.classList.add("d-none");
  previewPlaceholder.classList.add("d-none");
  previewLoading.classList.remove("d-none");
}

function mostrarPreviewPortada(url) {
  previewLoading.classList.add("d-none");
  if (url) {
    previewImg.src = url;
    previewImg.classList.remove("d-none");
    previewPlaceholder.classList.add("d-none");
  } else {
    previewImg.classList.add("d-none");
    previewPlaceholder.classList.remove("d-none");
  }
}

function resetPreviewPortada() {
  previewLoading.classList.add("d-none");
  previewImg.classList.add("d-none");
  previewPlaceholder.classList.remove("d-none");
  portadaActual = null;
}

inputTitulo.addEventListener("input", function () {
  clearTimeout(debouncePortada);
  const titulo = inputTitulo.value.trim();

  if (!titulo) {
    resetPreviewPortada();
    return;
  }

  mostrarPreviewCargando();

  debouncePortada = setTimeout(async () => {
    const autor = document.getElementById("autor").value.trim();
    const url = await buscarPortada(titulo, autor);

    // evita pisar el resultado si el usuario ya cambió el título mientras esperaba la respuesta
    if (inputTitulo.value.trim() !== titulo) return;

    portadaActual = url;
    mostrarPreviewPortada(url);
  }, 500);
});

// previene errror en el html por agregado de caracteres especiales en el título o autor del libro
function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !autor) return;

  libros.push({ id: crypto.randomUUID(), titulo, autor, categoria, portada: portadaActual });
  guardarLibros();
  form.reset();
  resetPreviewPortada();
  document.getElementById("titulo").focus();
  renderizarLibros();
});

lista.addEventListener("click", function (e) {
  const boton = e.target.closest(".btn-eliminar");
  if (!boton) return;

  libros = libros.filter(libro => libro.id !== boton.dataset.id);
  guardarLibros();
  renderizarLibros();
});

filtroCategoria.addEventListener("change", renderizarLibros);
inputBuscar.addEventListener("input", renderizarLibros);

// renderiza la lista de libros al cargar la página
renderizarLibros();
