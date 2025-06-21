import { db, storage } from './firebase-config.js';
import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const form = document.getElementById('producto-form');
const categoriasRef = collection(db, 'categorias');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const descripcion = form.descripcion.value.trim();
  let categoria = form.categoria.value;
  const precio = parseFloat(form.precio.value);
  const tallas = form.tallas.value.split(',').map(t => t.trim());
  const stock = parseInt(form.stock.value, 10);
  const imagenFile = form.imagen.files[0];

  if (categoria === 'otra') {
    categoria = document.getElementById('nueva-categoria').value.trim().toLowerCase();
  }

  if (!nombre || !descripcion || !categoria || !precio || !tallas.length || !stock || !imagenFile) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  let imagenURL = '';
  try {
    const storageRef = ref(storage, `productos/${Date.now()}_${imagenFile.name}`);
    await uploadBytes(storageRef, imagenFile);
    imagenURL = await getDownloadURL(storageRef);
  } catch (error) {
    alert('Error al subir la imagen.');
    return;
  }

  try {
    await addDoc(collection(db, 'productos'), {
      nombre,
      descripcion,
      categoria,
      precio,
      tallas,
      stock,
      imagen: imagenURL,
      creado: Timestamp.now()
    });

    alert('¡Producto guardado con éxito!');
    form.reset();
    document.getElementById('nueva-categoria-container').style.display = 'none';
  } catch (error) {
    alert('Error al guardar el producto');
  }
});

document.getElementById('nueva-categoria').addEventListener('blur', async function() {
  const nuevaCat = this.value.trim();
  if (nuevaCat) {
    const select = document.getElementById('categoria');
    const opcion = document.createElement('option');
    opcion.value = nuevaCat.toLowerCase();
    opcion.textContent = nuevaCat;
    select.insertBefore(opcion, select.querySelector('option[value="otra"]'));
    select.value = opcion.value;
    // Guardar la nueva categoría en Firestore
    try {
      await addDoc(categoriasRef, { nombre: nuevaCat.toLowerCase() });
    } catch (e) {
      alert('No se pudo guardar la nueva categoría');
    }
    this.value = '';
    document.getElementById('nueva-categoria-container').style.display = 'none';
  } else {
    document.getElementById('categoria').value = '';
    document.getElementById('nueva-categoria-container').style.display = 'none';
  }
});

async function cargarCategorias() {
  const select = document.getElementById('categoria');
  // Elimina las opciones existentes excepto la de "otra"
  [...select.options].forEach(opt => {
    if (opt.value && opt.value !== 'otra') select.removeChild(opt);
  });
  // Agrega las categorías desde Firestore
  const snapshot = await getDocs(categoriasRef);
  snapshot.forEach(doc => {
    const nombre = doc.data().nombre;
    if (![...select.options].some(opt => opt.value === nombre)) {
      const opcion = document.createElement('option');
      opcion.value = nombre;
      opcion.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
      select.insertBefore(opcion, select.querySelector('option[value="otra"]'));
    }
  });
}
document.addEventListener('DOMContentLoaded', cargarCategorias);
