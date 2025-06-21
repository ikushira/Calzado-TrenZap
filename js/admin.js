import { db, storage } from "./firebase-config.js";

// admin.js - Gestión de productos y duplicado en admin.html usando Firebase compat

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("producto-form");
  const mensajeEstado = document.getElementById("mensaje-estado");

  function mostrarMensaje(texto, tipo = "exito") {
    mensajeEstado.textContent = texto;
    mensajeEstado.style.display = "block";
    mensajeEstado.style.background = tipo === "exito" ? "#d4ffd4" : "#ffd4d4";
    mensajeEstado.style.color = tipo === "exito" ? "#1a4d1a" : "#a10000";
    mensajeEstado.style.border = tipo === "exito" ? "1px solid #1a4d1a" : "1px solid #a10000";
    setTimeout(() => {
      mensajeEstado.style.display = "none";
    }, 4000);
  }

  // SUBIR PRODUCTO NUEVO
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const categoriaSelect = document.getElementById("categoria");
    let categoria = categoriaSelect.value;
    if (categoria === "otra") {
      categoria = document.getElementById("nueva-categoria").value.trim();
    }
    const precio = parseFloat(document.getElementById("precio").value);
    const tallas = document.getElementById("tallas").value.split(",").map(t => t.trim());
    const stock = parseInt(document.getElementById("stock").value, 10);
    const imagenFile = document.getElementById("imagen").files[0];

    try {
      let imagenURL = "";
      if (imagenFile) {
        const storageRef = firebase.storage().ref(`productos/${Date.now()}_${imagenFile.name}`);
        await storageRef.put(imagenFile);
        imagenURL = await storageRef.getDownloadURL();
      }

      await firebase.firestore().collection("productos").add({
        nombre,
        descripcion,
        categoria,
        precio,
        tallas,
        stock,
        imagen: imagenURL,
        creado: firebase.firestore.Timestamp.now()
      });

      mostrarMensaje("¡Producto agregado correctamente!", "exito");
      form.reset();
      cargarProductosParaDuplicar(); // Refresca la lista de duplicar
    } catch (error) {
      console.error("Error al agregar producto:", error);
      mostrarMensaje("Error al agregar producto. Revisa la consola para más detalles.", "error");
    }
  });

  // MOSTRAR LISTA DE PRODUCTOS Y DUPLICAR
  const duplicarContainer = document.createElement("div");
  duplicarContainer.innerHTML = "<h3>Duplicar producto existente</h3><div id='lista-duplicar'></div>";
  form.parentNode.insertBefore(duplicarContainer, form.nextSibling);

  async function cargarProductosParaDuplicar() {
    const listaDiv = document.getElementById("lista-duplicar");
    listaDiv.innerHTML = "Cargando productos...";
    const snapshot = await firebase.firestore().collection("productos").orderBy("creado", "desc").limit(10).get();
    listaDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.style.border = "1px solid #39ff14";
      div.style.margin = "8px 0";
      div.style.padding = "8px";
      div.innerHTML = `
        <b>${p.nombre}</b> - $${p.precio} <button data-id="${doc.id}" class="btn-duplicar">Duplicar</button>
      `;
      listaDiv.appendChild(div);
    });

    // Evento duplicar
    listaDiv.querySelectorAll(".btn-duplicar").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const docSnap = await firebase.firestore().collection("productos").doc(id).get();
        if (docSnap.exists) {
          const prod = docSnap.data();
          // Rellenar el formulario con los datos del producto (excepto imagen)
          document.getElementById("nombre").value = prod.nombre + " (Copia)";
          document.getElementById("descripcion").value = prod.descripcion;
          document.getElementById("precio").value = prod.precio;
          document.getElementById("tallas").value = prod.tallas ? prod.tallas.join(",") : "";
          document.getElementById("stock").value = prod.stock;
          // Seleccionar categoría
          let found = false;
          for (let opt of document.getElementById("categoria").options) {
            if (opt.value === prod.categoria) {
              document.getElementById("categoria").value = prod.categoria;
              found = true;
              break;
            }
          }
          if (!found && prod.categoria) {
            // Agregar la categoría si no existe
            const select = document.getElementById("categoria");
            const opcion = document.createElement("option");
            opcion.value = prod.categoria;
            opcion.textContent = prod.categoria;
            select.insertBefore(opcion, select.querySelector('option[value="otra"]'));
            select.value = prod.categoria;
          }
          mostrarMensaje("Formulario rellenado. Cambia la imagen y los datos necesarios antes de guardar.", "exito");
        }
      });
    });
  }

  cargarProductosParaDuplicar();
});
