<?php
// php/compra.php
// Procesar la compra (ejemplo simple)

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $productos = $_POST['productos'] ?? [];
    $total = $_POST['total'] ?? 0;
    $usuario = $_SESSION['usuario'] ?? 'invitado';

    // Aquí podrías guardar la compra en una base de datos, enviar correo, etc.
    file_put_contents("compras.txt", date('Y-m-d H:i:s') . " | Usuario: $usuario | Total: $total\n", FILE_APPEND);

    echo json_encode(["mensaje" => "Compra registrada con éxito"]);
} else {
    echo json_encode(["error" => "Método no permitido"]);
}
?>
