<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Checkout - TrendZap</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <h1>Finalizar Compra</h1>
    <a href="index.html">Volver a la tienda</a>
  </header>

  <main>
    <form id="form-checkout">
      <label>Nombre Completo:</label><br>
      <input type="text" name="nombre" required><br><br>

      <label>Dirección de envío:</label><br>
      <input type="text" name="direccion" required><br><br>

      <label>Teléfono:</label><br>
      <input type="tel" name="telefono" required><br><br>

      <input type="hidden" name="productos" id="productos-hidden">
      <input type="hidden" name="total" id="total-hidden">

      <button type="submit">Confirmar Compra</button>
    </form>
  </main>

  <footer>
    <p>TrendZap © 2025</p>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
      document.getElementById('productos-hidden').value = JSON.stringify(carrito);
      document.getElementById('total-hidden').value = total;
    });

    document.getElementById('form-checkout').addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const res = await fetch('php/compra.php', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      alert(result.mensaje || result.error);
      localStorage.removeItem('carrito');
      window.location.href = 'index.html';
    });
  </script>
</body>
</html>
