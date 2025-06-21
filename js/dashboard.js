import { auth } from './firebase.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    mostrarPagina('inicio');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Deseas salir del sistema?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut().then(() => window.location.href = 'login.html');
    }
  });
});

document.querySelectorAll('button[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    mostrarPagina(btn.dataset.page);
  });
});

function mostrarPagina(pagina) {
  const cont = document.getElementById("contenido");
  cont.classList.remove("fade-in");

  setTimeout(() => {
    let html = "";

    if (pagina === 'inicio') {
      html = `
        <div class="card"><h2>Volumen Importado</h2><p>1,500 Tn</p></div>
        <div class="card"><h2>Contenedores en tránsito</h2><p>28</p></div>
        <div class="card"><h2>Producción estimada</h2><p>900 Tn</p></div>
        <div class="card"><h2>Gráfico</h2><canvas id="chartBanano" height="200"></canvas></div>
      `;
    } else if (pagina === 'importaciones') {
      html = `<div class="card"><h2>Control de Importaciones</h2><p>Estado de pedidos, aduanas, y embarques.</p></div>`;
    } else if (pagina === 'prediccion') {
      html = `<div class="card"><h2>Predicción de cosecha</h2><p>Proyecciones basadas en clima y producción histórica.</p></div>`;
    } else if (pagina === 'estadisticas') {
      html = `<div class="card"><h2>Estadísticas Históricas</h2><p>Rendimiento por mes, por finca y por región.</p></div>`;
    }

    cont.innerHTML = html;
    cont.classList.add("fade-in");

    if (pagina === "inicio") {
      setTimeout(() => {
        const ctx = document.getElementById('chartBanano').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
              label: 'Toneladas',
              data: [300, 450, 500, 400, 600],
              backgroundColor: '#fbbc05'
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      }, 100);
    }
  }, 200);
}
