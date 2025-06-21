const form = document.getElementById("formPrediccion");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  let rendimiento = 0;

  if (data.fase === "siembra") {
    rendimiento = data.temperatura * 2 + data.humedad * 0.5;
  } else if (data.fase === "floración") {
    rendimiento = data.temperatura * 2.5 + data.humedad * 0.7;
  } else {
    rendimiento = data.temperatura * 1.8 + data.humedad * 0.6;
  }

  resultado.textContent = `Cosecha estimada: ${rendimiento.toFixed(2)} toneladas por hectárea`;

  const ctx = document.getElementById("graficoPrediccion").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: 'Predicción (Tn/Ha)',
        data: [rendimiento * 0.6, rendimiento * 0.8, rendimiento * 0.9, rendimiento],
        borderColor: '#4caf50',
        tension: 0.3,
        fill: true,
        backgroundColor: 'rgba(76, 175, 80, 0.1)'
      }]
    },
    options: {
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } }
    }
  });
});
localStorage.setItem("ultimaPrediccion", JSON.stringify({
  rendimiento: rendimiento.toFixed(2),
  fecha: new Date().toLocaleString()
}));
