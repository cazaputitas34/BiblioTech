// biblioteca central - script.js

var STORAGE_KEY = "biblioteca-libros";
var STORAGE_KEY_RESERVAS = "biblioteca-reservas";
var STORAGE_KEY_PRESTAMOS = "biblioteca-prestamos";
var STORAGE_KEY_CATEGORIAS = "biblioteca-categorias-personalizadas";
var STORAGE_KEY_SOCIOS = "biblioteca-socios";
var STORAGE_KEY_MULTAS = "biblioteca-multas";
var STORAGE_KEY_HISTORIAL = "biblioteca-historial";
var STORAGE_KEY_USUARIOS = "biblioteca-usuarios";
var STORAGE_KEY_SESION = "biblioteca-sesion";

// cantidad de días que dura un préstamo antes de considerarse vencido
var DIAS_PRESTAMO = 14;

// categorías fijas de fábrica; las que el usuario crea con "Otro" se guardan aparte
var CATEGORIAS_BASE = ["Novela", "Ciencia ficción", "Infantil", "Poesía"];

var librosPorDefecto = [
  { id: crearId(), titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela", portada: null, codigoBarras: null, estado: "Disponible" },
  { id: crearId(), titulo: "1984", autor: "George Orwell", categoria: "Ciencia ficción", portada: null, codigoBarras: null, estado: "Disponible" },
  { id: crearId(), titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil", portada: null, codigoBarras: null, estado: "Disponible" },
  { id: crearId(), titulo: "Rayuela", autor: "Julio Cortázar", categoria: "Novela", portada: null, codigoBarras: null, estado: "Disponible" }
];

var libros = cargarLibros();
var reservas = cargarReservas();
var prestamos = cargarPrestamos();
var categoriasPersonalizadas = cargarCategoriasPersonalizadas();
var socios = cargarSocios();
var multas = cargarMultas();
var historial = cargarHistorial();
var usuarios = cargarUsuarios();
var sesionActual = cargarSesion();
var portadaEncontrada = null;
var portadaEditando = null;
var tituloOriginalEditando = "";
var tiempoEspera = null;
var tiempoEsperaEditar = null;
// si el usuario sube una imagen local a mano, dejamos de pisarla con la búsqueda automática
var portadaEsManual = false;
var portadaEditandoEsManual = false;

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

var inputCategoria = document.getElementById("categoria");
var grupoNuevaCategoria = document.getElementById("grupo-nueva-categoria");
var inputNuevaCategoria = document.getElementById("nueva-categoria");

var inputCodigoBarras = document.getElementById("codigo-barras");
var btnBuscarIsbn = document.getElementById("btn-buscar-isbn");
var inputImagenLocal = document.getElementById("imagen-local");

var modalEditar = new bootstrap.Modal(document.getElementById("modal-editar"));
var formEditar = document.getElementById("form-editar");
var editarId = document.getElementById("editar-id");
var editarTitulo = document.getElementById("editar-titulo");
var editarAutor = document.getElementById("editar-autor");
var editarCategoria = document.getElementById("editar-categoria");
var grupoEditarNuevaCategoria = document.getElementById("grupo-editar-nueva-categoria");
var inputEditarNuevaCategoria = document.getElementById("editar-nueva-categoria");
var editarCodigoBarras = document.getElementById("editar-codigo-barras");
var editarImagenLocal = document.getElementById("editar-imagen-local");
var editarPreviewImg = document.getElementById("editar-preview-img");
var editarPreviewPlaceholder = document.getElementById("editar-preview-placeholder");
var editarPreviewLoading = document.getElementById("editar-preview-loading");

// reservas y préstamos
var modalReservar = new bootstrap.Modal(document.getElementById("modal-reservar"));
var formReservar = document.getElementById("form-reservar");
var reservarLibroId = document.getElementById("reservar-libro-id");
var reservarLibroTitulo = document.getElementById("reservar-libro-titulo");
var reservarNombre = document.getElementById("reservar-nombre");
var reservarTipo = document.getElementById("reservar-tipo");

var modalPrestar = new bootstrap.Modal(document.getElementById("modal-prestar"));
var formPrestar = document.getElementById("form-prestar");
var prestarLibroId = document.getElementById("prestar-libro-id");
var prestarLibroTitulo = document.getElementById("prestar-libro-titulo");
var prestarNombre = document.getElementById("prestar-nombre");
var prestarFechaHoy = document.getElementById("prestar-fecha-hoy");

var listaReservas = document.getElementById("lista-reservas");
var estadoVacioReservas = document.getElementById("estado-vacio-reservas");
var listaPrestamos = document.getElementById("lista-prestamos");
var estadoVacioPrestamos = document.getElementById("estado-vacio-prestamos");
var filtroPrestamos = document.getElementById("filtro-prestamos");

// socios
var formSocio = document.getElementById("form-socio");
var socioNombreInput = document.getElementById("socio-nombre");
var socioTipoInput = document.getElementById("socio-tipo");
var listaSocios = document.getElementById("lista-socios");
var estadoVacioSocios = document.getElementById("estado-vacio-socios");
var datalistSocios = document.getElementById("datalist-socios");

// multas
var formMulta = document.getElementById("form-multa");
var multaSocioInput = document.getElementById("multa-socio");
var multaMotivoInput = document.getElementById("multa-motivo");
var multaMontoInput = document.getElementById("multa-monto");
var listaMultas = document.getElementById("lista-multas");
var estadoVacioMultas = document.getElementById("estado-vacio-multas");

// autenticación
var modalLogin = new bootstrap.Modal(document.getElementById("modal-login"));
var formLogin = document.getElementById("form-login");
var loginEmail = document.getElementById("login-email");
var loginPassword = document.getElementById("login-password");
var loginError = document.getElementById("login-error");

var modalRegistro = new bootstrap.Modal(document.getElementById("modal-registro"));
var formRegistro = document.getElementById("form-registro");
var registroNombre = document.getElementById("registro-nombre");
var registroEmail = document.getElementById("registro-email");
var registroPassword = document.getElementById("registro-password");
var registroPasswordConfirmar = document.getElementById("registro-password-confirmar");
var registroError = document.getElementById("registro-error");

var headerBtnLogin = document.getElementById("header-btn-login");
var headerBtnRegistro = document.getElementById("header-btn-registro");
var headerBtnLogout = document.getElementById("header-btn-logout");
var headerAuthInvitado = document.getElementById("header-auth-invitado");
var headerAuthSesion = document.getElementById("header-auth-sesion");
var headerUsuarioNombre = document.getElementById("header-usuario-nombre");

var linkIrARegistro = document.getElementById("link-ir-a-registro");
var linkIrALogin = document.getElementById("link-ir-a-login");

// reportes
var reportesStats = document.getElementById("reportes-stats");
var listaTopLibros = document.getElementById("lista-top-libros");
var estadoVacioTop = document.getElementById("estado-vacio-top");
var listaNotificaciones = document.getElementById("lista-notificaciones");
var estadoVacioNotificaciones = document.getElementById("estado-vacio-notificaciones");
var listaHistorial = document.getElementById("lista-historial");
var estadoVacioHistorial = document.getElementById("estado-vacio-historial");

function crearId() {
  return Date.now() + "-" + Math.floor(Math.random() * 1000000);
}

function cargarLibros() {
  var guardados = localStorage.getItem(STORAGE_KEY);
  var lista = guardados ? JSON.parse(guardados) : librosPorDefecto;
  // migración: los libros guardados antes de esta versión no tienen "estado" ni "codigoBarras"
  for (var i = 0; i < lista.length; i++) {
    if (!lista[i].estado) lista[i].estado = "Disponible";
    if (lista[i].codigoBarras === undefined) lista[i].codigoBarras = null;
  }
  return lista;
}

function guardarLibros() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
}

function cargarReservas() {
  var guardadas = localStorage.getItem(STORAGE_KEY_RESERVAS);
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarReservas() {
  localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservas));
}

function cargarPrestamos() {
  var guardados = localStorage.getItem(STORAGE_KEY_PRESTAMOS);
  return guardados ? JSON.parse(guardados) : [];
}

function guardarPrestamos() {
  localStorage.setItem(STORAGE_KEY_PRESTAMOS, JSON.stringify(prestamos));
}

function formatearFecha(fecha) {
  var dd = String(fecha.getDate()).padStart(2, "0");
  var mm = String(fecha.getMonth() + 1).padStart(2, "0");
  return dd + "/" + mm + "/" + fecha.getFullYear();
}

function fechaHoy() {
  return formatearFecha(new Date());
}

// convierte "dd/mm/yyyy" a un objeto Date
function parsearFecha(texto) {
  var partes = texto.split("/");
  return new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
}

// devuelve "dd/mm/yyyy" sumándole X días a una fecha en el mismo formato
function sumarDias(textoFecha, dias) {
  var fecha = parsearFecha(textoFecha);
  fecha.setDate(fecha.getDate() + dias);
  return formatearFecha(fecha);
}

function fechaVencida(textoFecha) {
  return parsearFecha(textoFecha).getTime() < parsearFecha(fechaHoy()).getTime();
}

// ------------------------------
// Socios (RF09): alta, consulta y estado activo/suspendido
// ------------------------------

function cargarSocios() {
  var guardados = localStorage.getItem(STORAGE_KEY_SOCIOS);
  return guardados ? JSON.parse(guardados) : [];
}

function guardarSocios() {
  localStorage.setItem(STORAGE_KEY_SOCIOS, JSON.stringify(socios));
}

function buscarSocioPorNombre(nombre) {
  var normalizado = (nombre || "").trim().toLowerCase();
  for (var i = 0; i < socios.length; i++) {
    if (socios[i].nombre.trim().toLowerCase() === normalizado) return socios[i];
  }
  return null;
}

// busca un socio por nombre; si no existe lo crea automáticamente (por ejemplo,
// cuando se reserva o presta un libro a nombre de alguien que todavía no está en la lista)
function buscarOCrearSocio(nombre, tipo) {
  var existente = buscarSocioPorNombre(nombre);
  if (existente) return existente;
  var nuevo = { id: crearId(), nombre: nombre.trim(), tipo: tipo || "Particular", estado: "Activo" };
  socios.push(nuevo);
  guardarSocios();
  renderizarSocios();
  return nuevo;
}

function actualizarDatalistSocios() {
  datalistSocios.innerHTML = socios.map(function (s) {
    return '<option value="' + escapeHtml(s.nombre) + '"></option>';
  }).join("");
}

function renderizarSocios() {
  actualizarDatalistSocios();
  listaSocios.innerHTML = "";
  estadoVacioSocios.classList.toggle("d-none", socios.length > 0);

  for (var i = 0; i < socios.length; i++) {
    var socio = socios[i];
    var claseEstado = socio.estado === "Suspendido" ? "estado-prestado" : "estado-disponible";
    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(socio.nombre) + "</h3>" +
      '<span class="etiqueta etiqueta-tipo me-2">' + escapeHtml(socio.tipo) + "</span>" +
      '<span class="etiqueta-estado ' + claseEstado + '">' + escapeHtml(socio.estado) + "</span></div>" +
      '<button class="btn-accion-libro" title="Cambiar estado" data-accion="toggle-estado-socio" data-id="' + socio.id + '"><i class="fa-solid fa-rotate"></i></button>' +
      '<button class="btn-accion-libro" title="Eliminar socio" data-accion="eliminar-socio" data-id="' + socio.id + '"><i class="fa-solid fa-trash"></i></button>';
    listaSocios.appendChild(li);
  }
}

formSocio.addEventListener("submit", function (e) {
  e.preventDefault();
  var nombre = socioNombreInput.value.trim();
  if (!nombre) return;
  if (buscarSocioPorNombre(nombre)) {
    alert("Ya existe un socio registrado con ese nombre.");
    return;
  }
  socios.push({ id: crearId(), nombre: nombre, tipo: socioTipoInput.value, estado: "Activo" });
  guardarSocios();
  registrarHistorial("Se registró al socio " + nombre + ".");
  renderizarSocios();
  formSocio.reset();
  socioNombreInput.focus();
});

listaSocios.addEventListener("click", function (e) {
  var boton = e.target.closest(".btn-accion-libro");
  if (!boton) return;
  var socio = null;
  for (var i = 0; i < socios.length; i++) {
    if (socios[i].id === boton.dataset.id) socio = socios[i];
  }
  if (!socio) return;

  if (boton.dataset.accion === "toggle-estado-socio") {
    socio.estado = socio.estado === "Suspendido" ? "Activo" : "Suspendido";
    registrarHistorial("El socio " + socio.nombre + " pasó a estado " + socio.estado + ".");
    guardarSocios();
    renderizarSocios();
  } else if (boton.dataset.accion === "eliminar-socio") {
    if (!confirm("¿Eliminar a este socio?")) return;
    socios = socios.filter(function (s) { return s.id !== socio.id; });
    guardarSocios();
    renderizarSocios();
  }
});

// ------------------------------
// Multas (RNF13): atrasos, pérdidas o deterioros
// ------------------------------

function cargarMultas() {
  var guardadas = localStorage.getItem(STORAGE_KEY_MULTAS);
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarMultas() {
  localStorage.setItem(STORAGE_KEY_MULTAS, JSON.stringify(multas));
}

function renderizarMultas() {
  listaMultas.innerHTML = "";
  estadoVacioMultas.classList.toggle("d-none", multas.length > 0);

  for (var i = 0; i < multas.length; i++) {
    var multa = multas[i];
    var claseEstado = multa.pagada ? "estado-disponible" : "estado-prestado";
    var textoEstado = multa.pagada ? "Pagada" : "Pendiente";
    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(multa.socio) + "</h3>" +
      '<p class="mb-1">' + escapeHtml(multa.motivo) + " · $" + escapeHtml(String(multa.monto)) + '<span class="etiqueta-estado ' + claseEstado + ' ms-2">' + textoEstado + "</span></p>" +
      '<p class="mb-0 text-muted small">Registrada el ' + multa.fecha + "</p></div>" +
      (multa.pagada ? "" : '<button class="btn-accion-libro" title="Marcar como pagada" data-accion="pagar-multa" data-id="' + multa.id + '"><i class="fa-solid fa-check"></i></button>') +
      '<button class="btn-accion-libro" title="Eliminar multa" data-accion="eliminar-multa" data-id="' + multa.id + '"><i class="fa-solid fa-trash"></i></button>';
    listaMultas.appendChild(li);
  }
}

formMulta.addEventListener("submit", function (e) {
  e.preventDefault();
  var nombreSocio = multaSocioInput.value.trim();
  var monto = Number(multaMontoInput.value);
  if (!nombreSocio || !monto) return;

  buscarOCrearSocio(nombreSocio, "Particular");

  multas.push({ id: crearId(), socio: nombreSocio, motivo: multaMotivoInput.value, monto: monto, fecha: fechaHoy(), pagada: false });
  guardarMultas();
  registrarHistorial("Se registró una multa de $" + monto + " a " + nombreSocio + " (" + multaMotivoInput.value + ").");
  renderizarMultas();
  formMulta.reset();
});

listaMultas.addEventListener("click", function (e) {
  var boton = e.target.closest(".btn-accion-libro");
  if (!boton) return;
  var multa = null;
  for (var i = 0; i < multas.length; i++) {
    if (multas[i].id === boton.dataset.id) multa = multas[i];
  }
  if (!multa) return;

  if (boton.dataset.accion === "pagar-multa") {
    multa.pagada = true;
    registrarHistorial("Se registró el pago de la multa de " + multa.socio + ".");
    guardarMultas();
    renderizarMultas();
  } else if (boton.dataset.accion === "eliminar-multa") {
    if (!confirm("¿Eliminar esta multa?")) return;
    multas = multas.filter(function (m) { return m.id !== multa.id; });
    guardarMultas();
    renderizarMultas();
  }
});

// ------------------------------
// Historial de actividad (RF16) y reportes (RF14) / notificaciones (RF13)
// ------------------------------

function cargarHistorial() {
  var guardado = localStorage.getItem(STORAGE_KEY_HISTORIAL);
  return guardado ? JSON.parse(guardado) : [];
}

function guardarHistorial() {
  // se conservan solo las últimas 50 entradas para no llenar el localStorage
  if (historial.length > 50) historial = historial.slice(historial.length - 50);
  localStorage.setItem(STORAGE_KEY_HISTORIAL, JSON.stringify(historial));
}

function registrarHistorial(texto) {
  historial.push({ id: crearId(), texto: texto, fecha: fechaHoy() });
  guardarHistorial();
  renderizarHistorial();
}

function renderizarHistorial() {
  if (!listaHistorial) return;
  var recientes = historial.slice().reverse().slice(0, 15);
  listaHistorial.innerHTML = "";
  estadoVacioHistorial.classList.toggle("d-none", recientes.length > 0);

  for (var i = 0; i < recientes.length; i++) {
    var entrada = recientes[i];
    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><p class="mb-0">' + escapeHtml(entrada.texto) + '</p>' +
      '<p class="mb-0 text-muted small">' + entrada.fecha + "</p></div>";
    listaHistorial.appendChild(li);
  }
}

function prestamosVencidos() {
  return prestamos.filter(function (p) {
    return !p.fechaDevolucion && p.fechaVencimiento && fechaVencida(p.fechaVencimiento);
  });
}

function renderizarNotificaciones() {
  var vencidos = prestamosVencidos();
  listaNotificaciones.innerHTML = "";
  estadoVacioNotificaciones.classList.toggle("d-none", vencidos.length > 0);

  for (var i = 0; i < vencidos.length; i++) {
    var prestamo = vencidos[i];
    var libro = buscarLibroPorId(prestamo.libroId);
    var tituloLibro = libro ? libro.titulo : "(libro eliminado)";
    var li = document.createElement("li");
    li.className = "reserva-item notificacion-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(tituloLibro) + "</h3>" +
      "<p class=\"mb-0 text-muted small\">Prestado a " + escapeHtml(prestamo.nombre) + " · venció el " + prestamo.fechaVencimiento + "</p></div>";
    listaNotificaciones.appendChild(li);
  }
}

function renderizarTopLibros() {
  var conteos = {};
  for (var i = 0; i < prestamos.length; i++) {
    var id = prestamos[i].libroId;
    conteos[id] = (conteos[id] || 0) + 1;
  }
  var ids = Object.keys(conteos).sort(function (a, b) { return conteos[b] - conteos[a]; }).slice(0, 5);

  listaTopLibros.innerHTML = "";
  estadoVacioTop.classList.toggle("d-none", ids.length > 0);

  for (var j = 0; j < ids.length; j++) {
    var libro = buscarLibroPorId(ids[j]);
    var titulo = libro ? libro.titulo : "(libro eliminado)";
    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(titulo) + "</h3></div>" +
      '<span class="etiqueta">' + conteos[ids[j]] + (conteos[ids[j]] === 1 ? " préstamo" : " préstamos") + "</span>";
    listaTopLibros.appendChild(li);
  }
}

function renderizarReportes() {
  var disponibles = libros.filter(function (l) { return l.estado === "Disponible"; }).length;
  var prestadosAhora = libros.filter(function (l) { return l.estado === "Prestado"; }).length;
  var reservadosAhora = libros.filter(function (l) { return l.estado === "Reservado"; }).length;
  var atrasados = prestamosVencidos().length;

  var stats = [
    { numero: libros.length, etiqueta: "Libros en catálogo" },
    { numero: disponibles, etiqueta: "Disponibles" },
    { numero: prestadosAhora, etiqueta: "Prestados" },
    { numero: reservadosAhora, etiqueta: "Reservados" },
    { numero: atrasados, etiqueta: "Préstamos atrasados" }
  ];

  reportesStats.innerHTML = stats.map(function (s) {
    return '<div class="col-6 col-md-4 col-lg"><div class="stat-card"><div class="stat-numero">' + s.numero + '</div><div class="stat-etiqueta">' + s.etiqueta + "</div></div></div>";
  }).join("");

  renderizarTopLibros();
  renderizarNotificaciones();
  renderizarHistorial();
}

var tabBtnReportes = document.getElementById("menu-tab-btn-reportes");
if (tabBtnReportes) tabBtnReportes.addEventListener("shown.bs.tab", renderizarReportes);

// ------------------------------
// Categorías (fijas + las que el usuario va creando con "Otro")
// ------------------------------

function cargarCategoriasPersonalizadas() {
  var guardadas = localStorage.getItem(STORAGE_KEY_CATEGORIAS);
  return guardadas ? JSON.parse(guardadas) : [];
}

function guardarCategoriasPersonalizadas() {
  localStorage.setItem(STORAGE_KEY_CATEGORIAS, JSON.stringify(categoriasPersonalizadas));
}

function todasLasCategorias() {
  return CATEGORIAS_BASE.concat(categoriasPersonalizadas);
}

// busca sin importar mayúsculas/espacios si una categoría con ese nombre ya existe,
// y devuelve el nombre "oficial" tal como está guardado
function buscarCategoriaExistente(nombre) {
  var normalizado = nombre.trim().toLowerCase();
  var todas = todasLasCategorias();
  for (var i = 0; i < todas.length; i++) {
    if (todas[i].toLowerCase() === normalizado) return todas[i];
  }
  return null;
}

// devuelve el nombre final de la categoría a usar: si ya existe, la reutiliza;
// si no, la crea y actualiza los combos. Devuelve null si el nombre está vacío.
function agregarCategoriaSiNoExiste(nombre) {
  var limpio = (nombre || "").trim();
  if (!limpio) return null;

  var existente = buscarCategoriaExistente(limpio);
  if (existente) return existente;

  categoriasPersonalizadas.push(limpio);
  guardarCategoriasPersonalizadas();
  actualizarSelectsCategoria();
  return limpio;
}

function construirOpcionesCategoria(incluirTodas, incluirOtro) {
  var html = "";
  if (incluirTodas) html += '<option value="Todas">Todas las categorías</option>';

  var todas = todasLasCategorias();
  for (var i = 0; i < todas.length; i++) {
    html += '<option value="' + escapeHtml(todas[i]) + '">' + escapeHtml(todas[i]) + "</option>";
  }

  if (incluirOtro) html += '<option value="Otro">Otro (nueva categoría)</option>';
  return html;
}

// reconstruye los 3 combos de categoría manteniendo, si es posible, el valor elegido
function actualizarSelectsCategoria() {
  [
    { select: inputCategoria, incluirTodas: false, incluirOtro: true },
    { select: editarCategoria, incluirTodas: false, incluirOtro: true },
    { select: filtroCategoria, incluirTodas: true, incluirOtro: false }
  ].forEach(function (conf) {
    var valorActual = conf.select.value;
    conf.select.innerHTML = construirOpcionesCategoria(conf.incluirTodas, conf.incluirOtro);
    var existeValor = Array.prototype.some.call(conf.select.options, function (o) { return o.value === valorActual; });
    if (existeValor) conf.select.value = valorActual;
  });
}

// muestra u oculta el campo de texto para escribir la categoría nueva
function actualizarVisibilidadNuevaCategoria(select, grupo, input) {
  var esOtro = select.value === "Otro";
  grupo.classList.toggle("d-none", !esOtro);
  if (!esOtro) input.value = "";
}

inputCategoria.addEventListener("change", function () {
  actualizarVisibilidadNuevaCategoria(inputCategoria, grupoNuevaCategoria, inputNuevaCategoria);
});

editarCategoria.addEventListener("change", function () {
  actualizarVisibilidadNuevaCategoria(editarCategoria, grupoEditarNuevaCategoria, inputEditarNuevaCategoria);
});

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

// convierte la imagen elegida por el usuario a base64 para guardarla de forma local
function leerImagenLocal(archivo, callback) {
  if (!archivo) return callback(null);
  var lector = new FileReader();
  lector.onload = function (e) { callback(e.target.result); };
  lector.onerror = function () { callback(null); };
  lector.readAsDataURL(archivo);
}

inputImagenLocal.addEventListener("change", function () {
  var archivo = inputImagenLocal.files && inputImagenLocal.files[0];
  if (!archivo) return;
  leerImagenLocal(archivo, function (dataUrl) {
    if (!dataUrl) return;
    portadaEsManual = true;
    portadaEncontrada = dataUrl;
    mostrarPreview(previewImg, previewPlaceholder, previewLoading, dataUrl, false);
  });
});

editarImagenLocal.addEventListener("change", function () {
  var archivo = editarImagenLocal.files && editarImagenLocal.files[0];
  if (!archivo) return;
  leerImagenLocal(archivo, function (dataUrl) {
    if (!dataUrl) return;
    portadaEditandoEsManual = true;
    portadaEditando = dataUrl;
    mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, dataUrl, false);
  });
});

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
      inputCategoria.value = mapearCategoria(info.categories);
      actualizarVisibilidadNuevaCategoria(inputCategoria, grupoNuevaCategoria, inputNuevaCategoria);

      if (!portadaEsManual) {
        var urlPortada = info.imageLinks ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail) : null;
        if (urlPortada) {
          urlPortada = urlPortada.replace("http://", "https://");
          portadaEncontrada = urlPortada;
          mostrarPreview(previewImg, previewPlaceholder, previewLoading, urlPortada, false);
        } else {
          // si Google Books no trae portada, probamos con Open Library
          buscarPortada(info.title, info.authors ? info.authors[0] : null, function (urlOpenLibrary) {
            if (portadaEsManual) return;
            portadaEncontrada = urlOpenLibrary;
            mostrarPreview(previewImg, previewPlaceholder, previewLoading, urlOpenLibrary, false);
          });
        }
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
  if (portadaEsManual) return; // el usuario ya eligió una imagen a mano, no la pisamos

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
      if (portadaEsManual) return;
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

    var claseEstado = libro.estado === "Prestado" ? "estado-prestado" : (libro.estado === "Reservado" ? "estado-reservado" : "estado-disponible");
    var estadoHtml = '<span class="etiqueta-estado ' + claseEstado + '">' + escapeHtml(libro.estado) + "</span>";
    var codigoBarrasHtml = libro.codigoBarras
      ? '<p class="mb-1 texto-codigo-barras"><i class="fa-solid fa-barcode me-1"></i>' + escapeHtml(libro.codigoBarras) + "</p>"
      : "";

    var extraInfoHtml = "";
    var accionesEstadoHtml = "";

    if (libro.estado === "Reservado") {
      var reserva = buscarReservaPorLibro(libro.id);
      if (reserva) {
        extraInfoHtml = '<p class="mb-0 texto-reserva">Reservado por: ' + escapeHtml(reserva.nombre) + " (" + escapeHtml(reserva.tipo) + ")</p>";
      }
      accionesEstadoHtml =
        '<button class="btn-accion-libro" title="Prestar" data-accion="prestar" data-id="' + libro.id + '"><i class="fa-solid fa-right-from-bracket"></i></button>' +
        '<button class="btn-accion-libro" title="Cancelar reserva" data-accion="cancelar-reserva" data-id="' + libro.id + '"><i class="fa-solid fa-ban"></i></button>';
    } else if (libro.estado === "Prestado") {
      var prestamo = buscarPrestamoActivoPorLibro(libro.id);
      if (prestamo) {
        extraInfoHtml = '<p class="mb-0 texto-reserva">Prestado a: ' + escapeHtml(prestamo.nombre) + " · " + prestamo.fechaPrestamo + "</p>";
      }
      accionesEstadoHtml = '<button class="btn-accion-libro" title="Devolver" data-accion="devolver" data-id="' + libro.id + '"><i class="fa-solid fa-rotate-left"></i></button>';
    } else {
      accionesEstadoHtml =
        '<button class="btn-accion-libro" title="Reservar" data-accion="reservar" data-id="' + libro.id + '"><i class="fa-solid fa-bookmark"></i></button>' +
        '<button class="btn-accion-libro" title="Prestar" data-accion="prestar" data-id="' + libro.id + '"><i class="fa-solid fa-right-from-bracket"></i></button>';
    }

    var li = document.createElement("li");
    li.className = "libro-item";
    li.innerHTML =
      portadaHtml +
      '<div class="libro-info flex-grow-1"><h3>' + escapeHtml(libro.titulo) + "</h3>" +
      "<p>Autor: " + escapeHtml(libro.autor) + "</p>" +
      codigoBarrasHtml +
      '<span class="etiqueta">' + escapeHtml(libro.categoria) + "</span> " + estadoHtml +
      extraInfoHtml + "</div>" +
      '<div class="acciones-libro">' + accionesEstadoHtml +
      '<button class="btn-editar" title="Editar" data-id="' + libro.id + '"><i class="fa-solid fa-pen"></i></button>' +
      '<button class="btn-eliminar" title="Eliminar" data-id="' + libro.id + '"><i class="fa-solid fa-trash"></i></button></div>';
    lista.appendChild(li);
  }
}

function buscarReservaPorLibro(libroId) {
  for (var i = 0; i < reservas.length; i++) {
    if (reservas[i].libroId === libroId) return reservas[i];
  }
  return null;
}

function buscarPrestamoActivoPorLibro(libroId) {
  for (var i = 0; i < prestamos.length; i++) {
    if (prestamos[i].libroId === libroId && !prestamos[i].fechaDevolucion) return prestamos[i];
  }
  return null;
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
  var codigoBarras = inputCodigoBarras.value.trim() || null;
  if (!titulo || !autor) return;

  var categoria;
  if (inputCategoria.value === "Otro") {
    categoria = agregarCategoriaSiNoExiste(inputNuevaCategoria.value);
    if (!categoria) {
      inputNuevaCategoria.focus();
      return;
    }
  } else {
    categoria = inputCategoria.value;
  }

  libros.push({ id: crearId(), titulo: titulo, autor: autor, categoria: categoria, portada: portadaEncontrada, codigoBarras: codigoBarras, estado: "Disponible" });
  guardarLibros();
  form.reset();
  portadaEncontrada = null;
  portadaEsManual = false;
  inputImagenLocal.value = "";
  actualizarVisibilidadNuevaCategoria(inputCategoria, grupoNuevaCategoria, inputNuevaCategoria);
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
    var id = botonEliminar.dataset.id;
    libros = libros.filter(function (l) { return l.id !== id; });
    reservas = reservas.filter(function (r) { return r.libroId !== id; });
    guardarLibros();
    guardarReservas();
    renderizarLibros();
    renderizarReservas();
    return;
  }

  var botonEditar = e.target.closest(".btn-editar");
  if (botonEditar) {
    abrirModalEditar(botonEditar.dataset.id);
    return;
  }

  var botonAccion = e.target.closest(".btn-accion-libro");
  if (!botonAccion) return;

  var accion = botonAccion.dataset.accion;
  var libroId = botonAccion.dataset.id;

  if (accion === "reservar") abrirModalReservar(libroId);
  else if (accion === "prestar") abrirModalPrestar(libroId);
  else if (accion === "devolver") devolverLibro(libroId);
  else if (accion === "cancelar-reserva") cancelarReserva(libroId);
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
  actualizarVisibilidadNuevaCategoria(editarCategoria, grupoEditarNuevaCategoria, inputEditarNuevaCategoria);
  editarCodigoBarras.value = libro.codigoBarras || "";
  editarImagenLocal.value = "";
  portadaEditando = libro.portada;
  portadaEditandoEsManual = false;
  tituloOriginalEditando = libro.titulo;
  mostrarPreview(editarPreviewImg, editarPreviewPlaceholder, editarPreviewLoading, portadaEditando, false);
  modalEditar.show();
}

editarTitulo.addEventListener("input", function () {
  if (portadaEditandoEsManual) return; // el usuario ya eligió una imagen a mano, no la pisamos

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
      if (portadaEditandoEsManual) return;
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

  var categoria;
  if (editarCategoria.value === "Otro") {
    categoria = agregarCategoriaSiNoExiste(inputEditarNuevaCategoria.value);
    if (!categoria) {
      inputEditarNuevaCategoria.focus();
      return;
    }
  } else {
    categoria = editarCategoria.value;
  }

  libro.titulo = titulo;
  libro.autor = autor;
  libro.categoria = categoria;
  libro.portada = portadaEditando;
  libro.codigoBarras = editarCodigoBarras.value.trim() || null;

  guardarLibros();
  renderizarLibros();
  modalEditar.hide();
});

// ------------------------------
// Reservas
// ------------------------------

function abrirModalReservar(libroId) {
  var libro = buscarLibroPorId(libroId);
  if (!libro) return;
  reservarLibroId.value = libro.id;
  reservarLibroTitulo.textContent = libro.titulo;
  reservarNombre.value = "";
  reservarTipo.value = "Particular";
  modalReservar.show();
}

// un "particular" solo puede tener 1 reserva activa a la vez;
// los centros educativos no tienen ese límite
function tieneReservaActivaParticular(nombre) {
  var nombreNormalizado = nombre.trim().toLowerCase();
  for (var i = 0; i < reservas.length; i++) {
    if (reservas[i].tipo === "Particular" && reservas[i].nombre.trim().toLowerCase() === nombreNormalizado) {
      return true;
    }
  }
  return false;
}

formReservar.addEventListener("submit", function (e) {
  e.preventDefault();
  var libroId = reservarLibroId.value;
  var nombre = reservarNombre.value.trim();
  var tipo = reservarTipo.value;
  if (!nombre) return;

  if (tipo === "Particular" && tieneReservaActivaParticular(nombre)) {
    alert("Este usuario particular ya tiene una reserva activa. Solo los centros educativos pueden reservar más de un libro a la vez.");
    return;
  }

  var libro = buscarLibroPorId(libroId);
  if (!libro) return;

  reservas.push({ id: crearId(), libroId: libroId, nombre: nombre, tipo: tipo, fecha: fechaHoy() });
  libro.estado = "Reservado";

  guardarReservas();
  guardarLibros();
  renderizarLibros();
  renderizarReservas();
  modalReservar.hide();
});

function cancelarReserva(libroId) {
  if (!confirm("¿Cancelar la reserva de este libro?")) return;
  reservas = reservas.filter(function (r) { return r.libroId !== libroId; });
  var libro = buscarLibroPorId(libroId);
  if (libro) libro.estado = "Disponible";
  guardarReservas();
  guardarLibros();
  renderizarLibros();
  renderizarReservas();
}

function renderizarReservas() {
  listaReservas.innerHTML = "";
  estadoVacioReservas.classList.toggle("d-none", reservas.length > 0);

  for (var i = 0; i < reservas.length; i++) {
    var reserva = reservas[i];
    var libro = buscarLibroPorId(reserva.libroId);
    if (!libro) continue;

    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(libro.titulo) + "</h3>" +
      "<p class=\"mb-1\">Solicitante: " + escapeHtml(reserva.nombre) + '<span class="etiqueta etiqueta-tipo ms-2">' + escapeHtml(reserva.tipo) + "</span></p>" +
      '<p class="mb-0 text-muted small">Reservado el ' + reserva.fecha + "</p></div>" +
      '<button class="btn-accion-libro" title="Prestar" data-accion="prestar" data-id="' + libro.id + '"><i class="fa-solid fa-right-from-bracket"></i></button>' +
      '<button class="btn-accion-libro" title="Cancelar reserva" data-accion="cancelar-reserva" data-id="' + libro.id + '"><i class="fa-solid fa-ban"></i></button>';
    listaReservas.appendChild(li);
  }
}

listaReservas.addEventListener("click", function (e) {
  var boton = e.target.closest(".btn-accion-libro");
  if (!boton) return;
  var accion = boton.dataset.accion;
  var libroId = boton.dataset.id;
  if (accion === "prestar") abrirModalPrestar(libroId);
  else if (accion === "cancelar-reserva") cancelarReserva(libroId);
});

// ------------------------------
// Préstamos y devoluciones
// ------------------------------

function abrirModalPrestar(libroId) {
  var libro = buscarLibroPorId(libroId);
  if (!libro) return;
  prestarLibroId.value = libro.id;
  prestarLibroTitulo.textContent = libro.titulo;
  var reserva = buscarReservaPorLibro(libroId);
  prestarNombre.value = reserva ? reserva.nombre : "";
  prestarFechaHoy.textContent = fechaHoy();
  modalPrestar.show();
}

formPrestar.addEventListener("submit", function (e) {
  e.preventDefault();
  var libroId = prestarLibroId.value;
  var nombre = prestarNombre.value.trim();
  if (!nombre) return;

  var libro = buscarLibroPorId(libroId);
  if (!libro) return;

  prestamos.push({ id: crearId(), libroId: libroId, nombre: nombre, fechaPrestamo: fechaHoy(), fechaDevolucion: null });
  reservas = reservas.filter(function (r) { return r.libroId !== libroId; });
  libro.estado = "Prestado";

  guardarPrestamos();
  guardarReservas();
  guardarLibros();
  renderizarLibros();
  renderizarReservas();
  renderizarPrestamos();
  modalPrestar.hide();
});

function devolverLibro(libroId) {
  if (!confirm("¿Registrar la devolución de este libro?")) return;
  var prestamo = buscarPrestamoActivoPorLibro(libroId);
  if (!prestamo) return;

  prestamo.fechaDevolucion = fechaHoy();
  var libro = buscarLibroPorId(libroId);
  if (libro) libro.estado = "Disponible";

  guardarPrestamos();
  guardarLibros();
  renderizarLibros();
  renderizarPrestamos();
}

function prestamosFiltrados() {
  var filtro = filtroPrestamos.value;
  var resultado = [];
  for (var i = 0; i < prestamos.length; i++) {
    var p = prestamos[i];
    if (filtro === "En curso" && p.fechaDevolucion) continue;
    if (filtro === "Devueltos" && !p.fechaDevolucion) continue;
    resultado.push(p);
  }
  // más recientes primero
  return resultado.slice().reverse();
}

function renderizarPrestamos() {
  var filtrados = prestamosFiltrados();
  listaPrestamos.innerHTML = "";
  estadoVacioPrestamos.classList.toggle("d-none", filtrados.length > 0);

  for (var i = 0; i < filtrados.length; i++) {
    var prestamo = filtrados[i];
    var libro = buscarLibroPorId(prestamo.libroId);
    var tituloLibro = libro ? libro.titulo : "(libro eliminado)";
    var estadoTexto = prestamo.fechaDevolucion ? "Devuelto el " + prestamo.fechaDevolucion : "En curso";
    var claseEstado = prestamo.fechaDevolucion ? "estado-disponible" : "estado-prestado";

    var li = document.createElement("li");
    li.className = "reserva-item";
    li.innerHTML =
      '<div class="flex-grow-1"><h3>' + escapeHtml(tituloLibro) + "</h3>" +
      "<p class=\"mb-1\">Prestatario: " + escapeHtml(prestamo.nombre) + "</p>" +
      '<p class="mb-0 text-muted small">Prestado el ' + prestamo.fechaPrestamo + "</p></div>" +
      '<span class="etiqueta-estado ' + claseEstado + '">' + estadoTexto + "</span>";
    listaPrestamos.appendChild(li);
  }
}

filtroPrestamos.addEventListener("change", renderizarPrestamos);

// ------------------------------
// Autenticación: registro, inicio de sesión y sesión activa
// ------------------------------

function cargarUsuarios() {
  var guardados = localStorage.getItem(STORAGE_KEY_USUARIOS);
  return guardados ? JSON.parse(guardados) : [];
}

function guardarUsuarios() {
  localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
}

function cargarSesion() {
  var guardada = localStorage.getItem(STORAGE_KEY_SESION);
  return guardada ? JSON.parse(guardada) : null;
}

function guardarSesion() {
  if (sesionActual) {
    localStorage.setItem(STORAGE_KEY_SESION, JSON.stringify(sesionActual));
  } else {
    localStorage.removeItem(STORAGE_KEY_SESION);
  }
}

function buscarUsuarioPorEmail(email) {
  var normalizado = (email || "").trim().toLowerCase();
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email.trim().toLowerCase() === normalizado) return usuarios[i];
  }
  return null;
}

function mostrarErrorLogin(mensaje) {
  loginError.textContent = mensaje;
  loginError.classList.remove("d-none");
}

function mostrarErrorRegistro(mensaje) {
  registroError.textContent = mensaje;
  registroError.classList.remove("d-none");
}

function abrirModalLogin() {
  formLogin.reset();
  loginError.classList.add("d-none");
  modalRegistro.hide();
  modalLogin.show();
}

function abrirModalRegistro() {
  formRegistro.reset();
  registroError.classList.add("d-none");
  modalLogin.hide();
  modalRegistro.show();
}

// refleja el estado de la sesión (invitado o con usuario) en el header
function actualizarUIAuth() {
  var haySesion = !!sesionActual;

  headerAuthInvitado.classList.toggle("d-none", haySesion);
  headerAuthSesion.classList.toggle("d-none", !haySesion);

  if (haySesion) {
    headerUsuarioNombre.textContent = sesionActual.nombre;
  }
}

formRegistro.addEventListener("submit", function (e) {
  e.preventDefault();
  registroError.classList.add("d-none");

  var nombre = registroNombre.value.trim();
  var email = registroEmail.value.trim();
  var password = registroPassword.value;
  var passwordConfirmar = registroPasswordConfirmar.value;

  if (!nombre || !email || !password) return;

  if (password.length < 6) {
    mostrarErrorRegistro("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (password !== passwordConfirmar) {
    mostrarErrorRegistro("Las contraseñas no coinciden.");
    return;
  }

  if (buscarUsuarioPorEmail(email)) {
    mostrarErrorRegistro("Ya existe una cuenta registrada con ese correo.");
    return;
  }

  var nuevoUsuario = { id: crearId(), nombre: nombre, email: email, password: password };
  usuarios.push(nuevoUsuario);
  guardarUsuarios();

  // inicia sesión automáticamente con la cuenta recién creada
  sesionActual = { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email };
  guardarSesion();
  actualizarUIAuth();
  registrarHistorial("Se registró la cuenta de " + nombre + ".");

  modalRegistro.hide();
});

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  loginError.classList.add("d-none");

  var email = loginEmail.value.trim();
  var password = loginPassword.value;
  if (!email || !password) return;

  var usuario = buscarUsuarioPorEmail(email);
  if (!usuario || usuario.password !== password) {
    mostrarErrorLogin("Correo o contraseña incorrectos.");
    return;
  }

  sesionActual = { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
  guardarSesion();
  actualizarUIAuth();

  modalLogin.hide();
});

function cerrarSesion() {
  sesionActual = null;
  guardarSesion();
  actualizarUIAuth();
}

headerBtnLogin.addEventListener("click", function (e) { e.preventDefault(); abrirModalLogin(); });
headerBtnRegistro.addEventListener("click", function (e) { e.preventDefault(); abrirModalRegistro(); });
headerBtnLogout.addEventListener("click", function (e) { e.preventDefault(); cerrarSesion(); });

linkIrARegistro.addEventListener("click", function (e) { e.preventDefault(); abrirModalRegistro(); });
linkIrALogin.addEventListener("click", function (e) { e.preventDefault(); abrirModalLogin(); });

// menú de secciones en móvil: al elegir una pestaña, se actualiza el texto
// del botón hamburguesa y se cierra el menú desplegado
var navTabsCollapseEl = document.getElementById("nav-tabs-collapse");
var navbarTogglerTexto = document.getElementById("navbar-toggler-texto");
if (navTabsCollapseEl && navbarTogglerTexto) {
  var navTabsCollapse = new bootstrap.Collapse(navTabsCollapseEl, { toggle: false });
  var botonesTab = document.querySelectorAll("#nav-tabs .nav-link");
  for (var bt = 0; bt < botonesTab.length; bt++) {
    botonesTab[bt].addEventListener("click", function () {
      navbarTogglerTexto.textContent = this.textContent.trim();
      navTabsCollapse.hide();
    });
  }
}

actualizarSelectsCategoria();
renderizarLibros();
renderizarReservas();
renderizarPrestamos();
actualizarUIAuth();