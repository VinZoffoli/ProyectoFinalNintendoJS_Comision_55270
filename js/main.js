// Se define un arreglo para almacenar los productos.
let productos = [];

// Se realiza una solicitud Fetch para obtener los datos de productos desde un archivo JSON.
fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");

    // Si hay un término de búsqueda, se filtran los productos y se cargan en la página.
    if (searchTerm) {
      const productosFiltrados = productos.filter((producto) =>
        producto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      cargarProductos(productosFiltrados);
    } else {
      cargarProductos(productos); // Si no hay búsqueda, se cargan todos los productos.
    }

    actualizarNumerito(); // Se actualiza el número de productos en el carrito.
  });

// Variables y selecciones de elementos del DOM.
let paginaActual = 1;
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const productosPorPagina = 8;
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get("search");
const searchIcon = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const productosFiltrados = [];
const botonesFiltro = document.querySelectorAll(".filters div[data-filter]");
const contenedorFiltros = document.querySelector(".filterswiper-wrapper");
const inputBuscador = document.querySelector(".Buscador input[type='text']");
const botonBuscador = document.querySelector(".Buscador .btn");
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numerito");
const numeritoIndex = document.querySelector("#numerito-index");


// Se agrega un evento a los botones de filtro para cambiar la lista de productos según la categoría seleccionada.
botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    const filtro = boton.getAttribute("data-filter");
    const productosFiltrados = productos.filter(
      (producto) => filtro === "todos" || producto.categoria.id === filtro
    );
    paginaActual = 1; // Se reinicia la página actual.
    cargarProductos(productosFiltrados);
    
  });
});

// Se agrega un evento al ícono de búsqueda para realizar una búsqueda al hacer clic.
searchIcon.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm) {
    const productosFiltrados = productos.filter((producto) =>
      producto.titulo.toLowerCase().includes(searchTerm)
    );
    cargarProductos(productosFiltrados);
  }
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      const productosFiltrados = productos.filter((producto) =>
        producto.titulo.toLowerCase().includes(searchTerm)
      );
      cargarProductos(productosFiltrados);
    }
  }
});

botonBuscador.addEventListener("click", () => {
  const searchTerm = inputBuscador.value.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    producto.titulo.toLowerCase().includes(searchTerm)
  );
  cargarProductos(productosFiltrados);
});

inputBuscador.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = inputBuscador.value.toLowerCase();
    const productosFiltrados = productos.filter((producto) =>
      producto.titulo.toLowerCase().includes(searchTerm)
    );
    cargarProductos(productosFiltrados);
  }
});

if (searchTerm) {
  const productosFiltrados = productos.filter((producto) =>
    producto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  cargarProductos(productosFiltrados);
}

// Se agrega un evento a los botones de categoría para cambiar la categoría de productos mostrados.
botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible"); // Oculta una barra lateral (supongo que no está en el código proporcionado). 
  })
);

// Función para cargar y mostrar los productos en la página.
function cargarProductos(productosElegidos) {
  contenedorProductos.innerHTML = "";
  const startIndex = (paginaActual - 1) * productosPorPagina;
  const endIndex = startIndex + productosPorPagina;
  const productosPagina = productosElegidos.slice(startIndex, endIndex);

  botonesFiltro.forEach((boton) => {
    boton.classList.remove("active");
    if (
      (boton.getAttribute("data-filter") === "todos" && paginaActual === 1) ||
      boton.getAttribute("data-filter") === productosElegidos[0].categoria.id
    ) {
      boton.classList.add("active");
    }
  });

  productosPagina.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("box", "item");

    div.innerHTML = `
    <div class="slide-img">
        <img src="${producto.imagen}" alt="${producto.titulo}" />
        <div class="overlay">
            <a href="#" class="buy-btn">Comprar</a>
            <a href="detalles.html?id=${producto.id}" class="details-btn">Ver detalles</a>


        </div>
    </div>
    <div class="detail-box">
        <div class="type">
            <a href="#">${producto.titulo}</a>
            <span>${producto.categoria.nombre}</span>
        </div>
        <a href="#" class="price">$${producto.precio}</a>
    </div>
`;

    const addToCartButton = div.querySelector(".buy-btn");
    const detailsButton = div.querySelector(".details-btn");

    addToCartButton.addEventListener("click", (event) => {
      event.preventDefault();
      agregarAlCarrito(producto);
    });

    // Agrega el evento para mostrar/ocultar el botón de detalles
    div.addEventListener("mouseover", () => {
      detailsButton.style.visibility = "visible";
      detailsButton.style.animation = "fade 0.5s";
    });

    div.addEventListener("mouseout", () => {
      detailsButton.style.visibility = "hidden";
    });

    contenedorProductos.append(div);
  });

  let totalPaginas = Math.ceil(productosElegidos.length / productosPorPagina);
  const totalPages = Math.ceil(productosElegidos.length / productosPorPagina);
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPaginas; i++) {
    const pageNumber = document.createElement("a");
    pageNumber.href = "#";
    pageNumber.textContent = i;
    pageNumber.classList.add("link");
    if (i === paginaActual) {
      pageNumber.classList.add("active");
    }

    pageNumber.addEventListener("click", () => {
      paginaActual = i;
      cargarProductos(productosElegidos);
    });

    paginationContainer.appendChild(pageNumber);
  }

  updateBtn(); // Se actualiza el estado de los botones de paginación.
}

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    e.currentTarget.classList.add("active");

    paginaActual = 1;

    if (e.currentTarget.id != "todos") {
      const productoCategoria = productos.find(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;
      const productosBoton = productos.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      cargarProductos(productosBoton);
    } else {
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
    botonBuscador.addEventListener("click", () => {
      const searchTerm = inputBuscador.value.toLowerCase();
      const categoriaActual = document.querySelector(
        ".boton-categoria.active"
      ).id;

      const productosFiltrados = productos.filter(
        (producto) =>
          (categoriaActual === "todos" ||
            producto.categoria.id === categoriaActual) &&
          producto.titulo.toLowerCase().includes(searchTerm)
      );

      cargarProductos(productosFiltrados);
    });

    inputBuscador.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const searchTerm = inputBuscador.value.toLowerCase();
        const categoriaActual = document.querySelector(
          ".boton-categoria.active"
        ).id;

        const productosFiltrados = productos.filter(
          (producto) =>
            (categoriaActual === "todos" ||
              producto.categoria.id === categoriaActual) &&
            producto.titulo.toLowerCase().includes(searchTerm)
        );

        cargarProductos(productosFiltrados);
      }
    });
  });
});

function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".add-to-cart");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

let productosEnCarrito = JSON.parse(
  localStorage.getItem("productos-en-carrito") || "[]"
);
actualizarNumerito();
let totalProductosEnCarrito = 0;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  actualizarNumerito();
} else {
  productosEnCarrito = [];
}

// Función para agregar un producto al carrito.
function agregarAlCarrito(producto) {
  Toastify({
    text: "Producto añadido",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  const productoEnCarrito = productosEnCarrito.find(
    (p) => p.id === producto.id
  );

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
  } else {
    producto.cantidad = 1;
    productosEnCarrito.push(producto);
  }

  totalProductosEnCarrito += producto.cantidad;
  actualizarNumerito();

  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}
// Función para actualizar la cantidad de productos en el carrito en la interfaz.
function actualizarNumerito() {
  const nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;

  const iconosCarrito = document.querySelectorAll(".fa-shopping-cart");
  iconosCarrito.forEach((icono) => {
    icono.nextElementSibling.textContent = nuevoNumerito;
  });
}

//PAGINATION//
const startBtn = document.querySelector("#startBtn"),
  endBtn = document.querySelector("#endBtn"),
  prevNext = document.querySelectorAll(".prevNext"),
  numbers = document.querySelectorAll(".link");

let currentStep = 0;

const updateBtn = () => {
  if (currentStep === 9) {
    endBtn.disabled = true;
    prevNext[1].disabled = true;
  } else if (currentStep === 0) {
    startBtn.disabled = true;
    prevNext[0].disabled = true;
  } else {
    endBtn.disabled = false;
    prevNext[1].disabled = false;
    startBtn.disabled = false;
    prevNext[0].disabled = false;
  }
};

// Se agrega un evento a los botones de navegación de página para gestionar la paginación.
prevNext.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (e.target.id === "prev" && paginaActual > 1) {
      paginaActual--;
    } else if (e.target.id === "next" && paginaActual < totalPages) {
      paginaActual++;
    }
    cargarProductos(productos);
    updateBtn();
  });
});

// Se agrega un evento a los números de página para permitir la navegación rápida a través de páginas.
numbers.forEach((number, numIndex) => {
  number.addEventListener("click", (e) => {
    e.preventDefault();
    paginaActual = numIndex + 1;
    cargarProductos(productos);
    updateBtn();
  });
});

// Se agrega un evento al botón "Start" para ir a la primera página.
startBtn.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  numbers[0].classList.add("active");
  currentStep = 0;
  updateBtn();
  endBtn.disabled = false;
  prevNext[1].disabled = false;
});

// Se agrega un evento al botón "End" para ir a la última página.
endBtn.addEventListener("click", () => {
  document.querySelector(".active").classList.remove("active");
  numbers[9].classList.add("active");
  currentStep = 9;
  updateBtn();
  startBtn.disabled = false;
  prevNext[0].disabled = false;
});

const allHoverImages = document.querySelectorAll(".hover-container div img");
const imgContainer = document.querySelector(".img-container");

window.addEventListener("DOMContentLoaded", () => {
  allHoverImages[0].parentElement.classList.add("active");
});

allHoverImages.forEach((image) => {
  image.addEventListener("mouseover", () => {
    imgContainer.querySelector("img").src = image.src;
    resetActiveImg();
    image.parentElement.classList.add("active");
  });
});

function resetActiveImg() {
  allHoverImages.forEach((img) => {
    img.parentElement.classList.remove("active");
  });
}

$(document).ready(function() {
  $(".fairy a").click(function(e) {
    e.preventDefault(); 
    $("html, body").animate({ scrollTop: $("#home").offset().top }, "slow");
  });
});

