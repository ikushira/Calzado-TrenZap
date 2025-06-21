// js/main.js
// Script principal para mostrar productos desde Firebase en index.html

document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById('lista-productos');
  if (!contenedor) return;

  contenedor.innerHTML = 'Cargando productos...';

  try {
    const querySnapshot = await firebase.firestore().collection("productos").orderBy("creado", "desc").get();
    if (querySnapshot.empty) {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }
    contenedor.innerHTML = '';
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
        <p><b>Tallas:</b> ${producto.tallas ? (Array.isArray(producto.tallas) ? producto.tallas.join(', ') : producto.tallas) : 'No especificadas'}</p>
        <p><b>Stock:</b> ${producto.stock ?? 'No especificado'}</p>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
  }
});
