// Sistema de Gestión de Inventario y Postcosecha
class SistemaInventario {
    constructor() {
        this.lotes = this.cargarDatos() || [];
        this.loteEditando = null;
        this.inicializar();
    }

    inicializar() {
        this.actualizarTabla();
        this.actualizarEstadisticas();
        this.configurarEventos();
        this.establecerFechaActual();
    }

    configurarEventos() {
        // Evento del formulario
        document.getElementById('formLote').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarLote();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('modalLote').addEventListener('click', (e) => {
            if (e.target.id === 'modalLote') {
                this.cerrarModal();
            }
        });

        // Escape para cerrar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        });
    }

    establecerFechaActual() {
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaCosecha').value = hoy;
    }

    // Gestión de datos
    cargarDatos() {
        const datos = window.__inventarioData || [];
        return datos;
    }

    guardarDatos() {
        window.__inventarioData = this.lotes;
    }

    // CRUD de lotes
    agregarLote(lote) {
        // Generar ID único
        lote.id = Date.now().toString();
        lote.fechaRegistro = new Date().toISOString();
        this.lotes.push(lote);
        this.guardarDatos();
        this.actualizarTabla();
        this.actualizarEstadisticas();
    }

    editarLote(id, loteActualizado) {
        const index = this.lotes.findIndex(l => l.id === id);
        if (index !== -1) {
            loteActualizado.id = id;
            loteActualizado.fechaRegistro = this.lotes[index].fechaRegistro;
            this.lotes[index] = loteActualizado;
            this.guardarDatos();
            this.actualizarTabla();
            this.actualizarEstadisticas();
        }
    }

    eliminarLote(id) {
        if (confirm('¿Está seguro de eliminar este lote? Esta acción no se puede deshacer.')) {
            this.lotes = this.lotes.filter(l => l.id !== id);
            this.guardarDatos();
            this.actualizarTabla();
            this.actualizarEstadisticas();
        }
    }

    // Funciones del modal
    abrirModal(lote = null) {
        const modal = document.getElementById('modalLote');
        const titulo = document.getElementById('modalTitulo');
        
        if (lote) {
            // Modo edición
            titulo.textContent = 'Editar Lote';
            this.loteEditando = lote.id;
            this.llenarFormulario(lote);
        } else {
            // Modo creación
            titulo.textContent = 'Agregar Nuevo Lote';
            this.loteEditando = null;
            this.limpiarFormulario();
            this.establecerFechaActual();
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        const modal = document.getElementById('modalLote');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.limpiarFormulario();
        this.loteEditando = null;
    }

    llenarFormulario(lote) {
        document.getElementById('codigoLote').value = lote.codigoLote;
        document.getElementById('finca').value = lote.finca;
        document.getElementById('fechaCosecha').value = lote.fechaCosecha;
        document.getElementById('peso').value = lote.peso;
        document.getElementById('estado').value = lote.estado;
        document.getElementById('calidad').value = lote.calidad;
        document.getElementById('color').value = lote.color;
        document.getElementById('tamano').value = lote.tamano;
        document.getElementById('plagas').value = lote.plagas;
        document.getElementById('notas').value = lote.notas || '';
    }

    limpiarFormulario() {
        document.getElementById('formLote').reset();
        document.getElementById('estado').value = 'disponible';
        document.getElementById('color').value = 'verde';
        document.getElementById('tamano').value = 'mediano';
        document.getElementById('plagas').value = 'ninguna';
    }

    guardarLote() {
        const formulario = document.getElementById('formLote');
        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const lote = {
            codigoLote: document.getElementById('codigoLote').value.trim(),
            finca: document.getElementById('finca').value.trim(),
            fechaCosecha: document.getElementById('fechaCosecha').value,
            peso: parseFloat(document.getElementById('peso').value),
            estado: document.getElementById('estado').value,
            calidad: document.getElementById('calidad').value,
            color: document.getElementById('color').value,
            tamano: document.getElementById('tamano').value,
            plagas: document.getElementById('plagas').value,
            notas: document.getElementById('notas').value.trim()
        };

        // Validar código único (excepto en edición)
        const codigoExiste = this.lotes.some(l => 
            l.codigoLote.toLowerCase() === lote.codigoLote.toLowerCase() && 
            l.id !== this.loteEditando
        );

        if (codigoExiste) {
            alert('Ya existe un lote con este código. Por favor, use un código diferente.');
            return;
        }

        if (this.loteEditando) {
            this.editarLote(this.loteEditando, lote);
        } else {
            this.agregarLote(lote);
        }

        this.cerrarModal();
    }

    // Actualización de la interfaz
    actualizarTabla() {
        const tbody = document.getElementById('tablaLotes');
        const mensajeVacio = document.getElementById('mensajeVacio');
        
        if (this.lotes.length === 0) {
            tbody.innerHTML = '';
            mensajeVacio.style.display = 'block';
            return;
        }

        mensajeVacio.style.display = 'none';
        
        const lotesOrdenados = this.obtenerLotesOrdenados();
        
        tbody.innerHTML = lotesOrdenados.map(lote => `
            <tr>
                <td><strong>${lote.codigoLote}</strong></td>
                <td>${lote.finca}</td>
                <td>${this.formatearFecha(lote.fechaCosecha)}</td>
                <td>${lote.peso.toFixed(1)} kg</td>
                <td><span class="estado-badge estado-${lote.estado}">${this.formatearEstado(lote.estado)}</span></td>
                <td><span class="calidad-badge calidad-${lote.calidad}">${this.formatearCalidad(lote.calidad)}</span></td>
                <td><span class="color-badge">${this.formatearColor(lote.color)}</span></td>
                <td>${this.formatearTamano(lote.tamano)}</td>
                <td><span class="plagas-badge plagas-${lote.plagas}">${this.formatearPlagas(lote.plagas)}</span></td>
                <td><span class="dias-almacenado ${this.obtenerClaseDias(lote.fechaCosecha)}">${this.calcularDiasAlmacenado(lote.fechaCosecha)} días</span></td>
                <td>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button class="btn btn-small btn-secondary" onclick="sistemaInventario.abrirModal(${JSON.stringify(lote).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small ${lote.estado === 'disponible' ? 'btn-warning' : 'btn-success'}" onclick="sistemaInventario.cambiarEstado('${lote.id}')">
                            <i class="fas ${lote.estado === 'disponible' ? 'fa-clock' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="sistemaInventario.eliminarLote('${lote.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    actualizarEstadisticas() {
        const totalLotes = this.lotes.length;
        const pesoTotal = this.lotes.reduce((total, lote) => total + lote.peso, 0);
        const disponibles = this.lotes.filter(l => l.estado === 'disponible').length;
        const reservados = this.lotes.filter(l => l.estado === 'reservado').length;
        const exportados = this.lotes.filter(l => l.estado === 'exportado').length;

        document.getElementById('totalLotes').textContent = totalLotes;
        document.getElementById('pesoTotal').textContent = `${pesoTotal.toFixed(1)} kg`;
        document.getElementById('disponibles').textContent = disponibles;
        document.getElementById('reservados').textContent = reservados;
        document.getElementById('exportados').textContent = exportados;
    }

    // Filtros y ordenamiento
    filtrarLotes() {
        this.actualizarTabla();
    }

    obtenerLotesOrdenados() {
        let lotesFiltrados = [...this.lotes];

        // Aplicar filtros
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const filtroEstado = document.getElementById('filtroEstado').value;
        const filtroCalidad = document.getElementById('filtroCalidad').value;

        if (busqueda) {
            lotesFiltrados = lotesFiltrados.filter(lote =>
                lote.codigoLote.toLowerCase().includes(busqueda) ||
                lote.finca.toLowerCase().includes(busqueda)
            );
        }

        if (filtroEstado) {
            lotesFiltrados = lotesFiltrados.filter(lote => lote.estado === filtroEstado);
        }

        if (filtroCalidad) {
            lotesFiltrados = lotesFiltrados.filter(lote => lote.calidad === filtroCalidad);
        }

        // Aplicar ordenamiento
        const ordenamiento = document.getElementById('ordenamiento').value;
        
        switch (ordenamiento) {
            case 'fecha_asc':
                lotesFiltrados.sort((a, b) => new Date(a.fechaCosecha) - new Date(b.fechaCosecha));
                break;
            case 'fecha_desc':
                lotesFiltrados.sort((a, b) => new Date(b.fechaCosecha) - new Date(a.fechaCosecha));
                break;
            case 'peso_desc':
                lotesFiltrados.sort((a, b) => b.peso - a.peso);
                break;
            case 'lote':
                lotesFiltrados.sort((a, b) => a.codigoLote.localeCompare(b.codigoLote));
                break;
        }

        return lotesFiltrados;
    }

    ordenarLotes() {
        this.actualizarTabla();
    }

    // Funciones auxiliares
    cambiarEstado(id) {
        const lote = this.lotes.find(l => l.id === id);
        if (!lote) return;

        let nuevoEstado;
        switch (lote.estado) {
            case 'disponible':
                nuevoEstado = 'reservado';
                break;
            case 'reservado':
                nuevoEstado = 'exportado';
                break;
            case 'exportado':
                nuevoEstado = 'disponible';
                break;
        }

        lote.estado = nuevoEstado;
        this.guardarDatos();
        this.actualizarTabla();
        this.actualizarEstadisticas();
    }

    calcularDiasAlmacenado(fechaCosecha) {
        const hoy = new Date();
        const cosecha = new Date(fechaCosecha);
        const diferencia = Math.floor((hoy - cosecha) / (1000 * 60 * 60 * 24));
        return Math.max(0, diferencia);
    }

    obtenerClaseDias(fechaCosecha) {
        const dias = this.calcularDiasAlmacenado(fechaCosecha);
        if (dias <= 7) return 'dias-fresh';
        if (dias <= 14) return 'dias-warning';
        return 'dias-danger';
    }

    formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    formatearEstado(estado) {
        const estados = {
            'disponible': 'Disponible',
            'reservado': 'Reservado',
            'exportado': 'Exportado'
        };
        return estados[estado] || estado;
    }

    formatearCalidad(calidad) {
        const calidades = {
            'excelente': 'Excelente',
            'buena': 'Buena',
            'regular': 'Regular',
            'rechazada': 'Rechazada'
        };
        return calidades[calidad] || calidad;
    }

    formatearColor(color) {
        const colores = {
            'verde': 'Verde',
            'amarillo': 'Amarillo',
            'rojo': 'Rojo',
            'mixto': 'Mixto'
        };
        return colores[color] || color;
    }

    formatearTamano(tamano) {
        const tamanos = {
            'pequeño': 'Pequeño',
            'mediano': 'Mediano',
            'grande': 'Grande',
            'extra_grande': 'Extra Grande'
        };
        return tamanos[tamano] || tamano;
    }

    formatearPlagas(plagas) {
        const plagasTexto = {
            'ninguna': 'Ninguna',
            'leve': 'Leve',
            'moderada': 'Moderada',
            'severa': 'Severa'
        };
        return plagasTexto[plagas] || plagas;
    }

    // Exportar datos
    exportarDatos() {
        if (this.lotes.length === 0) {
            alert('No hay datos para exportar');
            return;
        }

        const datosExportar = this.lotes.map(lote => ({
            'Código Lote': lote.codigoLote,
            'Finca': lote.finca,
            'Fecha Cosecha': lote.fechaCosecha,
            'Peso (kg)': lote.peso,
            'Estado': this.formatearEstado(lote.estado),
            'Calidad': this.formatearCalidad(lote.calidad),
            'Color': this.formatearColor(lote.color),
            'Tamaño': this.formatearTamano(lote.tamano),
            'Plagas': this.formatearPlagas(lote.plagas),
            'Días Almacenado': this.calcularDiasAlmacenado(lote.fechaCosecha),
            'Notas': lote.notas || ''
        }));

        const csv = this.convertirACSV(datosExportar);
        this.descargarCSV(csv, 'inventario_postcosecha.csv');
    }

    convertirACSV(datos) {
        if (datos.length === 0) return '';

        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(fila => 
            encabezados.map(campo => {
                const valor = fila[campo];
                // Escapar comillas y envolver en comillas si contiene comas
                return typeof valor === 'string' && (valor.includes(',') || valor.includes('"') || valor.includes('\n'))
                    ? `"${valor.replace(/"/g, '""')}"`
                    : valor;
            }).join(',')
        );

        return [encabezados.join(','), ...filas].join('\n');
    }

    descargarCSV(csv, nombreArchivo) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', nombreArchivo);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Generar datos de ejemplo para demostración
    generarDatosEjemplo() {
        const ejemplos = [
            {
                codigoLote: 'LOT-2024-001',
                finca: 'Finca San José',
                fechaCosecha: '2024-07-20',
                peso: 150.5,
                estado: 'disponible',
                calidad: 'excelente',
                color: 'verde',
                tamano: 'grande',
                plagas: 'ninguna',
                notas: 'Lote de excelente calidad, cosecha matutina'
            },
            {
                codigoLote: 'LOT-2024-002',
                finca: 'Finca El Paraíso',
                fechaCosecha: '2024-07-18',
                peso: 85.2,
                estado: 'reservado',
                calidad: 'buena',
                color: 'amarillo',
                tamano: 'mediano',
                plagas: 'leve',
                notas: 'Reservado para exportación europea'
            },
            {
                codigoLote: 'LOT-2024-003',
                finca: 'Finca La Esperanza',
                fechaCosecha: '2024-07-15',
                peso: 200.0,
                estado: 'exportado',
                calidad: 'excelente',
                color: 'rojo',
                tamano: 'extra_grande',
                plagas: 'ninguna',
                notas: 'Exportado a Estados Unidos'
            }
        ];

        ejemplos.forEach(ejemplo => this.agregarLote(ejemplo));
    }
}

// Funciones globales para eventos onclick
let sistemaInventario;

function abrirModal(lote = null) {
    sistemaInventario.abrirModal(lote);
}

function cerrarModal() {
    sistemaInventario.cerrarModal();
}

function filtrarLotes() {
    sistemaInventario.filtrarLotes();
}

function ordenarLotes() {
    sistemaInventario.ordenarLotes();
}

function exportarDatos() {
    sistemaInventario.exportarDatos();
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    sistemaInventario = new SistemaInventario();
    
    // Generar datos de ejemplo si no hay datos (solo para demostración)
    if (sistemaInventario.lotes.length === 0) {
        sistemaInventario.generarDatosEjemplo();
    }
});