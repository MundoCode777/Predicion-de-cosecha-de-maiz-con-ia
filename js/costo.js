        // Almacenamiento de datos con persistencia en localStorage
        let registros = [];

        // Función para cargar datos desde localStorage
        function cargarDatos() {
            try {
                const datosGuardados = localStorage.getItem('registrosCostos');
                if (datosGuardados) {
                    registros = JSON.parse(datosGuardados);
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                registros = [];
            }
        }

        // Función para guardar datos en localStorage
        function guardarEnLocalStorage() {
            try {
                localStorage.setItem('registrosCostos', JSON.stringify(registros));
            } catch (error) {
                console.error('Error al guardar datos:', error);
                swal({
                    title: "⚠️ Error",
                    text: "No se pudieron guardar los datos. Verifique el espacio disponible.",
                    icon: "error",
                    button: "Entendido"
                });
            }
        }

        function calcularRentabilidad() {
            const manoObra = parseFloat(document.getElementById('manoObra').value) || 0;
            const fertilizantes = parseFloat(document.getElementById('fertilizantes').value) || 0;
            const transporte = parseFloat(document.getElementById('transporte').value) || 0;
            const otrosCostos = parseFloat(document.getElementById('otrosCostos').value) || 0;
            const cantidadExportada = parseFloat(document.getElementById('cantidadExportada').value) || 0;
            const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;

            if (cantidadExportada === 0 || precioUnitario === 0) {
                swal({
                    title: "⚠️ Datos Incompletos",
                    text: "Por favor, complete la cantidad exportada y precio unitario para calcular la rentabilidad.",
                    icon: "warning",
                    button: "Entendido"
                });
                return;
            }

            const totalCostos = manoObra + fertilizantes + transporte + otrosCostos;
            const totalIngresos = cantidadExportada * precioUnitario;
            const ganancia = totalIngresos - totalCostos;
            const rentabilidad = totalCostos > 0 ? ((ganancia / totalCostos) * 100) : 0;
            const costoUnitario = cantidadExportada > 0 ? (totalCostos / cantidadExportada) : 0;

            // Mostrar resultados
            document.getElementById('totalCostos').textContent = `$${totalCostos.toFixed(2)}`;
            document.getElementById('totalIngresos').textContent = `$${totalIngresos.toFixed(2)}`;
            document.getElementById('rentabilidad').textContent = `${rentabilidad.toFixed(1)}%`;
            
            const gananciaText = document.getElementById('gananciaText');
            if (ganancia >= 0) {
                gananciaText.textContent = `Ganancia: $${ganancia.toFixed(2)}`;
                gananciaText.className = 'profit-positive';
            } else {
                gananciaText.textContent = `Pérdida: $${Math.abs(ganancia).toFixed(2)}`;
                gananciaText.className = 'profit-negative';
            }

            document.getElementById('costoUnitario').textContent = 
                `Costo por kg: $${costoUnitario.toFixed(2)}`;

            document.getElementById('resultsSection').style.display = 'block';
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

            // Mostrar alerta de resultado
            const mensaje = ganancia >= 0 ? 
                `¡Excelente! La operación genera una ganancia de $${ganancia.toFixed(2)} con una rentabilidad del ${rentabilidad.toFixed(1)}%` :
                `⚠️ La operación presenta una pérdida de $${Math.abs(ganancia).toFixed(2)}. Revise sus costos.`;

            swal({
                title: ganancia >= 0 ? "✅ Análisis Completado" : "⚠️ Análisis Completado",
                text: mensaje,
                icon: ganancia >= 0 ? "success" : "warning",
                button: "Continuar"
            });
        }

        function guardarDatos() {
            const finca = document.getElementById('finca').value.trim();
            const temporada = document.getElementById('temporada').value;
            
            if (!finca || !temporada) {
                swal({
                    title: "⚠️ Datos Incompletos",
                    text: "Por favor, complete el nombre de la finca y la temporada antes de guardar.",
                    icon: "warning",
                    button: "Entendido"
                });
                return;
            }

            const manoObra = parseFloat(document.getElementById('manoObra').value) || 0;
            const fertilizantes = parseFloat(document.getElementById('fertilizantes').value) || 0;
            const transporte = parseFloat(document.getElementById('transporte').value) || 0;
            const otrosCostos = parseFloat(document.getElementById('otrosCostos').value) || 0;
            const cantidadExportada = parseFloat(document.getElementById('cantidadExportada').value) || 0;
            const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;

            const totalCostos = manoObra + fertilizantes + transporte + otrosCostos;
            const totalIngresos = cantidadExportada * precioUnitario;
            const ganancia = totalIngresos - totalCostos;
            const rentabilidad = totalCostos > 0 ? ((ganancia / totalCostos) * 100) : 0;

            // Verificar si ya existe un registro con la misma finca y temporada
            const existeRegistro = registros.findIndex(r => r.finca === finca && r.temporada === temporada);
            
            const registro = {
                id: existeRegistro >= 0 ? registros[existeRegistro].id : Date.now(),
                finca,
                temporada,
                costos: {
                    manoObra,
                    fertilizantes,
                    transporte,
                    otros: otrosCostos,
                    total: totalCostos
                },
                cantidadExportada,
                precioUnitario,
                ingresos: totalIngresos,
                ganancia,
                rentabilidad,
                fecha: new Date().toLocaleDateString()
            };

            if (existeRegistro >= 0) {
                // Actualizar registro existente
                swal({
                    title: "⚠️ Registro Existente",
                    text: `Ya existe un registro para ${finca} - ${temporada}. ¿Desea actualizarlo?`,
                    icon: "warning",
                    buttons: ["Cancelar", "Actualizar"],
                }).then((willUpdate) => {
                    if (willUpdate) {
                        registros[existeRegistro] = registro;
                        guardarEnLocalStorage();
                        swal({
                            title: "✅ Registro Actualizado",
                            text: `El registro para ${finca} - ${temporada} ha sido actualizado exitosamente.`,
                            icon: "success",
                            button: "Perfecto"
                        });
                    }
                });
            } else {
                // Nuevo registro
                registros.push(registro);
                guardarEnLocalStorage();
                swal({
                    title: "✅ Datos Guardados",
                    text: `El registro para ${finca} - ${temporada} ha sido guardado exitosamente.`,
                    icon: "success",
                    button: "Perfecto"
                });
            }
        }

        function mostrarComparacion() {
            if (registros.length === 0) {
                swal({
                    title: "📊 Sin Datos",
                    text: "No hay registros guardados para mostrar la comparación. Primero guarde algunos datos.",
                    icon: "info",
                    button: "Entendido"
                });
                return;
            }

            const tbody = document.getElementById('comparisonTableBody');
            tbody.innerHTML = '';

            registros.forEach((registro, index) => {
                const row = document.createElement('tr');
                const rentabilidadClass = registro.ganancia >= 0 ? 'profit-positive' : 'profit-negative';
                
                row.innerHTML = `
                    <td>${registro.finca}</td>
                    <td>${registro.temporada}</td>
                    <td>$${registro.costos.total.toFixed(2)}</td>
                    <td>$${registro.ingresos.toFixed(2)}</td>
                    <td class="${rentabilidadClass}">$${registro.ganancia.toFixed(2)}</td>
                    <td class="${rentabilidadClass}">${registro.rentabilidad.toFixed(1)}%</td>
                    <td>${registro.fecha}</td>
                    <td>
                        <button class="delete-btn" onclick="eliminarRegistro(${index})" title="Eliminar registro">
                            🗑️
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            document.getElementById('comparisonSection').style.display = 'block';
            document.getElementById('comparisonSection').scrollIntoView({ behavior: 'smooth' });

            swal({
                title: "📈 Comparación Lista",
                text: `Se muestran ${registros.length} registro(s) para comparación.`,
                icon: "info",
                button: "Ver Tabla"
            });
        }

        function eliminarRegistro(index) {
            const registro = registros[index];
            swal({
                title: "🗑️ Eliminar Registro",
                text: `¿Está seguro de que desea eliminar el registro de ${registro.finca} - ${registro.temporada}?`,
                icon: "warning",
                buttons: ["Cancelar", "Eliminar"],
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    registros.splice(index, 1);
                    guardarEnLocalStorage();
                    mostrarComparacion(); // Actualizar la tabla
                    swal({
                        title: "✅ Registro Eliminado",
                        text: "El registro ha sido eliminado exitosamente.",
                        icon: "success",
                        button: "Entendido"
                    });
                }
            });
        }

        function limpiarFormulario() {
            swal({
                title: "🗑️ Limpiar Formulario",
                text: "¿Está seguro de que desea limpiar todos los campos del formulario?",
                icon: "warning",
                buttons: ["Cancelar", "Limpiar"],
                dangerMode: true,
            }).then((willClear) => {
                if (willClear) {
                    document.getElementById('finca').value = '';
                    document.getElementById('manoObra').value = '';
                    document.getElementById('fertilizantes').value = '';
                    document.getElementById('transporte').value = '';
                    document.getElementById('otrosCostos').value = '';
                    document.getElementById('cantidadExportada').value = '';
                    document.getElementById('precioUnitario').value = '';
                    document.getElementById('temporada').value = '';
                    
                    document.getElementById('resultsSection').style.display = 'none';
                    document.getElementById('comparisonSection').style.display = 'none';

                    swal("✅ Formulario limpiado exitosamente", {
                        icon: "success",
                    });
                }
            });
        }

        function volverAlDashboard() {
            // Ocultar secciones de resultados y comparación
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('comparisonSection').style.display = 'none';
            
            // Hacer scroll suave al top de la página para mostrar el dashboard
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            swal({
                title: "🏠 Dashboard",
                text: "Ha regresado al panel principal.",
                icon: "info",
                button: "Continuar",
                timer: 1500
            });
        }

        function eliminarTodosLosDatos() {
            if (registros.length === 0) {
                swal({
                    title: "📊 Sin Datos",
                    text: "No hay registros guardados para eliminar.",
                    icon: "info",
                    button: "Entendido"
                });
                return;
            }

            swal({
                title: "⚠️ Eliminar Todos los Datos",
                text: `¿Está seguro de que desea eliminar TODOS los ${registros.length} registros guardados? Esta acción no se puede deshacer.`,
                icon: "warning",
                buttons: ["Cancelar", "Eliminar Todo"],
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    registros = [];
                    guardarEnLocalStorage();
                    
                    // Ocultar secciones si están visibles
                    document.getElementById('comparisonSection').style.display = 'none';
                    document.getElementById('resultsSection').style.display = 'none';
                    
                    swal({
                        title: "✅ Datos Eliminados",
                        text: "Todos los registros han sido eliminados permanentemente.",
                        icon: "success",
                        button: "Entendido"
                    });
                }
            });
        }

        function agregarDatosEjemplo() {
            const ejemplos = [
                {
                    id: 1,
                    finca: "Finca El Progreso",
                    temporada: "2024-1",
                    costos: { manoObra: 5000, fertilizantes: 3000, transporte: 1500, otros: 1000, total: 10500 },
                    cantidadExportada: 1000,
                    precioUnitario: 15.00,
                    ingresos: 15000,
                    ganancia: 4500,
                    rentabilidad: 42.9,
                    fecha: "15/08/2024"
                },
                {
                    id: 2,
                    finca: "Finca San José",
                    temporada: "2024-1",
                    costos: { manoObra: 4500, fertilizantes: 2800, transporte: 1200, otros: 800, total: 9300 },
                    cantidadExportada: 800,
                    precioUnitario: 15.00,
                    ingresos: 12000,
                    ganancia: 2700,
                    rentabilidad: 29.0,
                    fecha: "20/08/2024"
                },
                {
                    id: 3,
                    finca: "Finca La Esperanza",
                    temporada: "2024-2",
                    costos: { manoObra: 5500, fertilizantes: 3200, transporte: 1600, otros: 1200, total: 11500 },
                    cantidadExportada: 1200,
                    precioUnitario: 14.50,
                    ingresos: 17400,
                    ganancia: 5900,
                    rentabilidad: 51.3,
                    fecha: "25/09/2024"
                }
            ];
            
            // Solo agregar ejemplos si no hay datos guardados
            if (registros.length === 0) {
                registros = ejemplos;
                guardarEnLocalStorage();
            }
        }

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar datos existentes
            cargarDatos();
            
            // Si no hay datos, agregar ejemplos
            if (registros.length === 0) {
                agregarDatosEjemplo();
            }
            
            const mensaje = registros.length > 0 ? 
                `Sistema cargado exitosamente. Tienes ${registros.length} registro(s) guardado(s).` :
                "Sistema cargado exitosamente. ¡Listo para comenzar!";
            
            // Mensaje de bienvenida con información sobre persistencia
            swal({
                title: "🎉 ¡Bienvenido!",
                text: mensaje + " Tus datos se guardan automáticamente y persisten entre sesiones.",
                icon: "success",
                button: "Comenzar"
            });
        });

        // Prevenir pérdida de datos al cerrar la ventana
        window.addEventListener('beforeunload', function(e) {
            if (registros.length > 0) {
                guardarEnLocalStorage();
            }
        });

        // Función para detectar y manejar errores
        window.addEventListener('error', function(e) {
            console.error('Error detectado:', e.error);
            guardarEnLocalStorage(); // Guardar datos antes de cualquier problema
        });