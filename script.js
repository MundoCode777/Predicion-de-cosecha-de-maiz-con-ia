document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    const temperatura = parseFloat(document.getElementById('temperatura').value);
    const humedad = parseFloat(document.getElementById('humedad').value);
    const precipitacion = parseFloat(document.getElementById('precipitacion').value);

    // Predicción básica simulada
    let prediccion = "";

    if (temperatura >= 20 && temperatura <= 30 &&
        humedad >= 50 && humedad <= 80 &&
        precipitacion >= 500 && precipitacion <= 1000) {
        prediccion = "¡Buena cosecha esperada! Condiciones óptimas.";
    } else if ((temperatura > 30 || temperatura < 20) ||
               (humedad < 40 || humedad > 90) ||
               (precipitacion < 400 || precipitacion > 1200)) {
        prediccion = "Cuidado: Condiciones desfavorables para el maíz.";
    } else {
        prediccion = "Cosecha moderada. Algunas condiciones no son ideales.";
    }

    document.getElementById('resultado').textContent = prediccion;
});