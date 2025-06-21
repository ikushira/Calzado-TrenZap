// js/main.js
// Script principal para mostrar productos desde Firebase en index.html

// Importa Firestore desde tu configuración de Firebase
import { db } from './firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

// Función para renderizar productos en la página principal
async function cargarProductos() {
  const contenedor = document.getElementById('lista-productos');
  contenedor.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'productos'));
    if (querySnapshot.empty) {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }
    querySnapshot.forEach((doc) => {
      const producto = doc.data();

      const card = document.createElement('div');
      card.className = 'producto-card';

      card.innerHTML = `
        <img src="${producto.imagen || ''}" alt="${producto.nombre || ''}" class="producto-img" />
        <h3>${producto.nombre || 'Sin nombre'}</h3>
        <p>${producto.descripcion || 'Sin descripción'}</p>
        <p><strong>$${producto.precio ? producto.precio.toLocaleString() : '0'}</strong></p>
        <p><b>Categoría:</b> ${producto.categoria || 'Sin categoría'}</p>
        <p><b>Tallas:</b> ${producto.tallas ? producto.tallas.join(', ') : 'No especificadas'}</p>
        <p><b>Stock:</b> ${producto.stock ?? 'No especificado'}</p>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
  }
}

// Ejecutar al cargar la página
if (document.getElementById('lista-productos')) {
  cargarProductos();
}
