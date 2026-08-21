// biblioteca central - script.js

var STORAGE_KEY = "biblioteca-libros";

var librosPorDefecto = [
  { id: crearId(), titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela", portada: null },
  { id: crearId(), titulo: "1984", autor: "George Orwell", categoria: "Ciencia ficción", portada: null },
  { id: crearId(), titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil", portada: null },
  { id: crearId(), titulo: "Rayuela", autor: "Julio Cortázar", categoria: "Novela", portada: null }
];

var libros = cargarLibros();
var portadaEncontrada = null;
var portadaEditando = null;
var tituloOriginalEditando = "";
var tiempoEspera = null;
var tiempoEsperaEditar = null;

var lista = document.getElementById("lista-libros");
var estadoVacio = document.getElementById("estado-vacio");
var contador = document.getElementById("contador-libros");
var form = document.getElementById("form-libro");
var inputBuscar = document.getElementById("buscar");
var filtroCategoria = document.getElementById("filtro-categoria");
var inputTitulo = document.getElementById("titulo");
var previewImg = document.getElementById("preview-portada-img");
var previewPlaceholder = document.getElementById("preview-portada-placeholder");
var previewLoading = document.getElementById("preview-portada-loading");

var inputCodigoBarras = document.getElementById("codigo-barras");
var btnBuscarIsbn = document.getElementById("btn-buscar-isbn");

var modalEditar = new bootstrap.Modal(document.getElementById("modal-editar"));
var formEditar = document.getElementById("form-editar");
var editarId = document.getElementById("editar-id");
var editarTitulo = document.getElementById("editar-titulo");
var editarAutor = document.getElementById("editar-autor");
var editarCategoria = document.getElementById("editar-categoria");
var editarPreviewImg = document.getElementById("editar-preview-img");
var editarPreviewPlaceholder = document.getElementById("editar-preview-placeholder");
var editarPreviewLoading = document.getElementById("editar-preview-loading");

function crearId() {
  return Date.now() + "-" + Math.floor(Math.random() * 1000000);
}

function cargarLibros() {
  var guardados = localStorage.getItem(STORAGE_KEY);
  return guardados ? JSON.parse(guardados) : librosPorDefecto;
}

function guardarLibros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
}

// busca la portada del libro en Open Library y avisa el resultado con un callback
function buscarPortada(titulo, autor, callback) {
  if (!titulo) return callback(null);

  var url = "https://openlibrary.org/search.json?title=" + encodeURIComponent(titulo) + "&limit=1";
  if (autor) url += "&author=" + encodeURIComponent(autor);

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (datos) {
      var libro = datos.docs && datos.docs[0];
      if (libro && libro.cover_i) {
        callback("https://covers.openlibrary.org/b/id/" + libro.cover_i + "-M.jpg");
      } else {
        callback(null);
      }
    })
    .catch(function () { callback(null); });
}

function mostrarPreview(img, placeholder, loading, url, cargando) {
  loading.classList.toggle("d-none", !cargando);
  img.classList.toggle("d-none", cargando || !url);
  placeholder.classList.toggle("d-none", cargando || !!url);
  if (url) img.src = url;
}

// ------------------------------
// Buscar libro por código de barras / ISBN
// ------------------------------

// un lector físico de código de barras funciona como un teclado: escribe
// los números muy rápido y al final manda un Enter, así que con eso alcanza
inputCodigoBarras.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    dispararBusquedaIsbn();
  }
});

btnBuscarIsbn.addEventListener("click", function () {
  dispararBusquedaIsbn();
});

function dispararBusquedaIsbn() {
  var isbn = inputCodigoBarras.value.trim();
  if (!isbn) return;
  buscarLibroPorIsbn(isbn);
}
function buscarLibroPorIsbn(isbn) {
  var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (datos) {
      if (!datos.items || datos.items.length === 0) {
        alert("No se encontró ningún libro con ese código de barras.");
        return;
      }

      var info = datos.items[0].volumeInfo;

      inputTitulo.value = info.title || "";
      document.getElementById("autor").value = info.authors ? info.authors.join(", ") : "";
      document.getElementById("categoria").value = mapearCategoria(info.categories);

      var urlPortada = info.imageLinks ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail) : null;
      if (urlPortada) {
        urlPortada = urlPortada.replace("http://", "https://");
        portadaEncontrada = urlPortada;
        mostrarPreview(previewImg, previewPlaceholder, previewLoading, urlPortada, false);
      } else {
        // si Google Books no trae portada, probamos con Open Library
        buscarPortada(info.title, info.authors ? info.authors[0] : null, function (urlOpenLibrary) {
          portadaEncontrada = urlOpenLibrary;
          mostrarPreview(previewImg, previewPlaceholder, previewLoading, urlOpenLibrary, false);
        });
      }
    })
    .catch(function () {
      alert("Hubo un error buscando el libro. Probá de nuevo.");
    });
}

// traduce las categorías de Google Books a las categorías de nuestro catálogo
function mapearCategoria(categorias) {
  if (!categorias) return "Otro";
  var texto = categorias.join(" ").toLowerCase();

  if (texto.indexOf("science fiction") !== -1 || texto.indexOf("sci-fi") !== -1) return "Ciencia ficción";
  if (texto.indexOf("juvenile") !== -1 || texto.indexOf("children") !== -1) return "Infantil";
  if (texto.indexOf("poetry") !== -1) return "Poesía";
  if (texto.indexOf("fiction") !== -1) return "Novela";
  return "Otro";
}

inputTitulo.addEventListener("input", function () {
  clearTimeout(tiempoEspera);
  var titulo = inputTitulo.value.trim();

  if (!titulo) {
    portadaEncontrada = null;
    mostrarPreview(previewImg, previewPlaceholder, previewLoading, null, false);
    return;
  }

  mostrarPreview(previewImg, previewPlaceholder, previewLoading, null, true);

  tiempoEspera = setTimeout(function () {
    var autor = document.getElementById("autor").value.trim();
    buscarPortada(titulo, autor, function (url) {
      if (inputTitulo.value.trim() !== titulo) return;
      portadaEncontrada = url;
      mostrarPreview(previewImg, previewPlaceholder, previewLoading, url, false);
    });
  }, 500);
});

function librosFiltrados() {
  var categoria = filtroCategoria.value;
  var texto = inputBuscar.value.trim().toLowerCase();

  var resultado = [];
  for (var i = 0; i < libros.length; i++) {
    var libro = libros[i];
    var coincideCategoria = categoria === "Todas" || libro.categoria === categoria;
    var coincideTexto = libro.titulo.toLowerCase().indexOf(texto) !== -1 || libro.autor.toLowerCase().indexOf(texto) !== -1;
    if (coincideCategoria && coincideTexto) resultado.push(libro);
  }
  return resultado;
}

function renderizarLibros() {
  var filtrados = librosFiltrados();
  lista.innerHTML = "";
  estadoVacio.classList.toggle("d-none", filtrados.length > 0);
  contador.textContent = libros.length + " " + (libros.length === 1 ? "libro" : "libros");

  for (var i = 0; i < filtrados.length; i++) {
    var libro = filtrados[i];
    var portadaHtml = libro.portada
      ? '<img class="libro-portada" src="' + libro.portada + '" alt="Portada">'
      : '<div class="libro-portada"><i class="fa-solid fa-book"></i></div>';

    var li = document.createElement("li");
    li.className = "libro-item";
    li.innerHTML =
      portadaHtml +
      '<div class="libro-info flex-grow-1"><h3>' + escapeHtml(libro.titulo) + "</h3>" +
      "<p>Autor: " + escapeHtml(libro.autor) + "</p>" +
      '<span class="etiqueta">' + escapeHtml(libro.categoria) + "</span></div>" +
      '<button class="btn-editar" title="Editar" data-id="' + libro.id + '"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="btn-eliminar" title="Eliminar" data-id="' + libro.id + '"><i class="fa-solid fa-trash"></i></button>';
    lista.appendChild(li);
  }
}

function escapeHtml(texto) {
  var div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var titulo = document.getElementById("titulo").value.trim();
  var autor = document.getElementById("autor").value.trim();
  var categoria = document.getElementById("categoria").value;
  if (!titulo || !autor) return;

  libros.push({ id: crearId(), titulo: titulo, autor: autor, categoria: categoria, portada: portadaEncontrada });
  guardarLibros();
  form.reset();
  portadaEncontrada = null;
  mostrarPreview(previewImg, previewPlaceholder, previewLoading, null, false);
  document.getElementById("titulo").focus();
  renderizarLibros();
});

function buscarLibroPorId(id) {
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id === id) return libros[i];
  }
  return null;
}

lista.addEventListener("click", function (e) {
  var botonEliminar = e.target.closest(".btn-eliminar");
  if (botonEliminar) {
    libros = libros.filter(function (l) { return l.id !== botonEliminar.dataset.id; });
    guardarLibros();
    renderizarLibros();
    return;
  }

  var botonEditar = e.target.closest(".btn-editar");
  if (botonEditar) abrirModalEditar(botonEditar.dataset.id);
});

filtroCategoria.addEventListener("change", renderizarLibros);
inputBuscar.addEventListener("input", renderizarLibros);

function abrirModalEditar(id) {
  var libro = buscarLibroPorId(id);
  if (!libro) return;

  editarId.value = libro.id;
  editarTitulo.value = libro.titulo;
  editarAutor.value = libro.autor;
  editarCategoria.value = libro.categoria;
  portadaEditando = libro.portada;
  tituloOriginalEditando = libro.titulo;
  mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, portadaEditando, false);
  modalEditar.show();
}

editarTitulo.addEventListener("input", function () {
  clearTimeout(tiempoEsperaEditar);
  var titulo = editarTitulo.value.trim();

  if (!titulo) {
    portadaEditando = null;
    mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, null, false);
    return;
  }

  if (titulo === tituloOriginalEditando) {
    var libroActual = buscarLibroPorId(editarId.value);
    portadaEditando = libroActual ? libroActual.portada : null;
    mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, portadaEditando, false);
    return;
  }

  mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, null, true);

  tiempoEsperaEditar = setTimeout(function () {
    var autor = editarAutor.value.trim();
    buscarPortada(titulo, autor, function (url) {
      if (editarTitulo.value.trim() !== titulo) return;
      portadaEditando = url;
      mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, url, false);
    });
  }, 500);
});

formEditar.addEventListener("submit", function (e) {
  e.preventDefault();
  var titulo = editarTitulo.value.trim();
  var autor = editarAutor.value.trim();
  if (!titulo || !autor) return;

  var libro = buscarLibroPorId(editarId.value);
  if (!libro) return;

  libro.titulo = titulo;
  libro.autor = autor;
  libro.categoria = editarCategoria.value;
  libro.portada = portadaEditando;

  guardarLibros();
  renderizarLibros();
  modalEditar.hide();
});

renderizarLibros();
