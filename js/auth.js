import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

// js/auth.js
// Script para proteger páginas como admin.html

// Este script verifica si hay un usuario autenticado
// Si no lo hay, redirecciona al login

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // No hay sesión activa, redirigir al login
    window.location.href = 'login.html';
  }
});
