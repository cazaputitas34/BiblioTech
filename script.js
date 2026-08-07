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
    li.innerHTML = `
      <div class="libro-info">
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

  libros.push({ id: crypto.randomUUID(), titulo, autor, categoria });
  guardarLibros();
  form.reset();
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
