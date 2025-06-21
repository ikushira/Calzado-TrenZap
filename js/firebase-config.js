// Configuración de Firebase usando scripts CDN (compat)
const firebaseConfig = {
  apiKey: "AIzaSyApT7US4oqtbAczDkvjp8cBj1y4qiFesws",
  authDomain: "calzado-trendzap.firebaseapp.com",
  projectId: "calzado-trendzap",
  storageBucket: "calzado-trendzap.appspot.com",
  messagingSenderId: "721505110941",
  appId: "1:721505110941:web:67c72a1c99aaf96ee4bd74",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}