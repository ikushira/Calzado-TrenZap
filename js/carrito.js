// js/carrito.js
// Manejo básico del carrito de compras con localStorage

// Obtener carrito del almacenamiento local o inicializar vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
  const index = carrito.findIndex(p => p.id === producto.id);
  if (index >= 0) {
    carrito[index].cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Producto agregado al carrito');
}

// Función para mostrar el contenido del carrito en una tabla
function mostrarCarrito() {
  const tabla = document.getElementById('tabla-carrito');
  tabla.innerHTML = '';
  let total = 0;

  carrito.forEach((producto, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.precio}</td>
      <td>${producto.cantidad}</td>
      <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
      <td><button onclick="eliminarDelCarrito(${i})">Eliminar</button></td>
    `;
    tabla.appendChild(fila);
    total += producto.precio * producto.cantidad;
  });

  document.getElementById('total-carrito').innerText = 'Total: $' + total.toFixed(2);
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

// Llamar esta función en la página de carrito.html si existe la tabla
if (document.getElementById('tabla-carrito')) {
  mostrarCarrito();
}
