// lista placeholder de los libros para despues agregar la funcion de agregar todos los libros al sql
let libros = [
  { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela" },
  { titulo: "1984", autor: "George Orwell", categoria: "Ciencia ficción" },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil" },
  { titulo: "Rayuela", autor: "Julio Cortázar", categoria: "Novela" }
];

const lista = document.getElementById("lista-libros");
const form = document.getElementById("form-libro");
const filtroCategoria = document.getElementById("filtro-categoria");

function renderizarLibros() {
  const categoriaSeleccionada = filtroCategoria.value;
  lista.innerHTML = "";

  const librosFiltrados = categoriaSeleccionada === "Todas"
    ? libros
    : libros.filter(libro => libro.categoria === categoriaSeleccionada);

  if (librosFiltrados.length === 0) {
    lista.innerHTML = "<p>No hay libros en esta categoría.</p>";
    return;
  }

  librosFiltrados.forEach(libro => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${libro.titulo}</h3>
      <p>Autor: ${libro.autor}</p>
      <span class="etiqueta">${libro.categoria}</span>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();
  const categoria = document.getElementById("categoria").value;

  if (titulo === "" || autor === "") return;

  libros.push({ titulo, autor, categoria });

  form.reset();
  renderizarLibros();
});

filtroCategoria.addEventListener("change", renderizarLibros);

// muestra los libros si se recarga la página
renderizarLibros();
