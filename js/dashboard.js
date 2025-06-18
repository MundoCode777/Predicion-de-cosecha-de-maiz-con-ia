import { auth } from './firebase.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

// Verificar autenticación al cargar
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    document.getElementById("contenido").innerHTML = `
      <h1>Bienvenido, ${user.displayName || user.email}</h1>
      <p>Selecciona una opción del menú para comenzar.</p>
    `;
  }
});

// Manejar cierre de sesión con confirmación
document.getElementById('logoutBtn').addEventListener('click', () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¿Deseas cerrar sesión?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut().then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Sesión cerrada',
          text: 'Redirigiendo al login...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => window.location.href = 'login.html');
      }).catch(() => {
        Swal.fire("Error", "No se pudo cerrar sesión", "error");
      });
    }
  });
});

// Navegación del menú
document.querySelectorAll('.sidebar button[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    mostrarPagina(page);
  });
});

function mostrarPagina(pagina) {
  let contenidoHTML = '';

  switch (pagina) {
    case 'inicio':
      contenidoHTML = `
        <h1>Inicio</h1>
        <p>Bienvenido a la plataforma de predicción de cosecha de maíz.</p>`;
      break;
    case 'modelo':
      contenidoHTML = `
        <h1>Predicción</h1>
        <p>Esta sección mostrará los resultados del modelo de predicción.</p>`;
      break;
    case 'reportes':
      contenidoHTML = `
        <h1>Reportes</h1>
        <p>Aquí se mostrarán los reportes históricos de producción.</p>`;
      break;
    default:
      contenidoHTML = `<h1>Error</h1><p>Sección no encontrada.</p>`;
  }

  document.getElementById("contenido").innerHTML = contenidoHTML;
}
