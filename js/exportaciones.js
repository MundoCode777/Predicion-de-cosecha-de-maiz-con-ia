// Variables globales
let orders = [];
let currentEditingOrder = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    updateDashboard();
    updateOrdersList();
    populateDocumentSelect();
    
    // Event listeners
    document.getElementById('pedido-form').addEventListener('submit', handleNewOrder);
    document.getElementById('edit-form').addEventListener('submit', handleEditOrder);
    document.getElementById('search-orders').addEventListener('input', filterOrders);
    document.getElementById('filter-status').addEventListener('change', filterOrders);
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('editModal')) {
            closeModal();
        }
    });
});

// Cargar datos de ejemplo
function loadSampleData() {
    const sampleOrders = [
        {
            id: 'EXP001',
            cliente: 'Fresh Fruits International',
            paisDestino: 'Estados Unidos',
            variedad: 'Banano Cavendish',
            cantidad: 1500,
            fechaEnvio: '2025-07-25',
            precioUnitario: 1.25,
            estado: 'proceso',
            fechaCreacion: '2025-07-20',
            tracking: 'TRK001USA',
            transporte: 'Naviera ABC - Container MAEU123456'
        },
        {
            id: 'EXP002',
            cliente: 'European Banana Co.',
            paisDestino: 'España',
            variedad: 'Banano Orgánico',
            cantidad: 2000,
            fechaEnvio: '2025-07-22',
            precioUnitario: 1.45,
            estado: 'enviado',
            fechaCreacion: '2025-07-18',
            tracking: 'TRK002ESP',
            transporte: 'Mediterranean Shipping - Container MSCU789012'
        }
    ];
    
    orders = sampleOrders;
}

// Navegación entre secciones
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
}

// Generar ID único
function generateOrderId() {
    const number = (orders.length + 1).toString().padStart(3, '0');
    return `EXP${number}`;
}

// Manejar nuevo pedido
function handleNewOrder(e) {
    e.preventDefault();
    
    const newOrder = {
        id: generateOrderId(),
        cliente: document.getElementById('cliente').value,
        paisDestino: document.getElementById('pais-destino').value,
        variedad: document.getElementById('variedad').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        fechaEnvio: document.getElementById('fecha-envio').value,
        precioUnitario: parseFloat(document.getElementById('precio-unitario').value),
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString().split('T')[0],
        notas: document.getElementById('notas').value,
        tracking: '',
        transporte: ''
    };
    
    orders.push(newOrder);
    
    // Reset form
    document.getElementById('pedido-form').reset();
    
    // Update displays
    updateDashboard();
    updateOrdersList();
    populateDocumentSelect();
    
    alert('Pedido registrado exitosamente con ID: ' + newOrder.id);
}

// Actualizar dashboard
function updateDashboard() {
    const stats = {
        total: orders.length,
        pendiente: orders.filter(o => o.estado === 'pendiente').length,
        proceso: orders.filter(o => o.estado === 'proceso').length,
        enviado: orders.filter(o => o.estado === 'enviado').length,
        entregado: orders.filter(o => o.estado === 'entregado').length
    };
    
    document.getElementById('total-pedidos').textContent = stats.total;
    document.getElementById('pedidos-pendientes').textContent = stats.pendiente;
    document.getElementById('pedidos-enviados').textContent = stats.enviado;
    document.getElementById('pedidos-entregados').textContent = stats.entregado;
    
    // Mostrar pedidos recientes
    const recentOrders = orders.slice(-3).reverse();
    const recentOrdersHtml = recentOrders.map(order => createOrderCard(order, true)).join('');
    document.getElementById('recent-orders').innerHTML = recentOrdersHtml;
}

// Crear tarjeta de pedido
function createOrderCard(order, isRecent = false) {
    const totalValue = (order.cantidad * order.precioUnitario).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <div class="status-badge status-${order.estado}">${order.estado.toUpperCase()}</div>
            </div>
            <div class="order-details">
                <div class="detail-item">
                    <div class="detail-label">Cliente</div>
                    <div class="detail-value">${order.cliente}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Destino</div>
                    <div class="detail-value">${order.paisDestino}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Variedad</div>
                    <div class="detail-value">${order.variedad}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Cantidad</div>
                    <div class="detail-value">${order.cantidad.toLocaleString()} unidades</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Fecha Envío</div>
                    <div class="detail-value">${new Date(order.fechaEnvio).toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Valor Total</div>
                    <div class="detail-value">${totalValue}</div>
                </div>
                ${order.tracking ? `
                <div class="detail-item">
                    <div class="detail-label">Tracking</div>
                    <div class="detail-value">${order.tracking}</div>
                </div>
                ` : ''}
            </div>
            ${!isRecent ? `
            <div class="order-actions">
                <button class="btn-secondary" onclick="editOrder('${order.id}')">✏️ Editar</button>
                <button class="btn-secondary" onclick="trackOrderById('${order.id}')">🔍 Seguir</button>
                <button class="btn-secondary" onclick="deleteOrder('${order.id}')">🗑️ Eliminar</button>
            </div>
            ` : ''}
        </div>
    `;
}

// Actualizar lista de pedidos
function updateOrdersList() {
    const ordersHtml = orders.map(order => createOrderCard(order, false)).join('');
    document.getElementById('orders-list').innerHTML = ordersHtml;
}

// Filtrar pedidos
function filterOrders() {
    const searchTerm = document.getElementById('search-orders').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    
    let filteredOrders = orders;
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.cliente.toLowerCase().includes(searchTerm) ||
            order.paisDestino.toLowerCase().includes(searchTerm) ||
            order.id.toLowerCase().includes(searchTerm) ||
            order.variedad.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.estado === statusFilter);
    }
    
    const ordersHtml = filteredOrders.map(order => createOrderCard(order, false)).join('');
    document.getElementById('orders-list').innerHTML = ordersHtml;
}

// Editar pedido
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    currentEditingOrder = order;
    
    document.getElementById('edit-status').value = order.estado;
    document.getElementById('edit-tracking').value = order.tracking || '';
    document.getElementById('edit-transport').value = order.transporte || '';
    
    document.getElementById('editModal').style.display = 'block';
}

// Manejar edición de pedido
function handleEditOrder(e) {
    e.preventDefault();
    
    if (!currentEditingOrder) return;
    
    currentEditingOrder.estado = document.getElementById('edit-status').value;
    currentEditingOrder.tracking = document.getElementById('edit-tracking').value;
    currentEditingOrder.transporte = document.getElementById('edit-transport').value;
    
    closeModal();
    updateDashboard();
    updateOrdersList();
    
    alert('Pedido actualizado exitosamente');
}

// Cerrar modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingOrder = null;
}

// Eliminar pedido
function deleteOrder(orderId) {
    if (confirm('¿Está seguro de eliminar este pedido?')) {
        orders = orders.filter(o => o.id !== orderId);
        updateDashboard();
        updateOrdersList();
        populateDocumentSelect();
        alert('Pedido eliminado exitosamente');
    }
}

// Seguimiento de pedido
function trackOrder() {
    const orderId = document.getElementById('tracking-id').value.trim();
    if (!orderId) {
        alert('Por favor ingrese un ID de pedido');
        return;
    }
    
    trackOrderById(orderId);
}

function trackOrderById(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        document.getElementById('tracking-result').innerHTML = `
            <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 10px; margin-top: 20px;">
                No se encontró ningún pedido con el ID: ${orderId}
            </div>
        `;
        return;
    }
    
    const trackingSteps = [
        { step: 'Pedido Registrado', status: 'completed', date: order.fechaCreacion },
        { step: 'En Preparación', status: order.estado !== 'pendiente' ? 'completed' : 'pending', date: order.estado !== 'pendiente' ? order.fechaCreacion : null },
        { step: 'Enviado', status: ['enviado', 'entregado'].includes(order.estado) ? 'completed' : 'pending', date: ['enviado', 'entregado'].includes(order.estado) ? order.fechaEnvio : null },
        { step: 'En Tránsito', status: ['enviado', 'entregado'].includes(order.estado) ? 'completed' : 'pending', date: null },
        { step: 'Entregado', status: order.estado === 'entregado' ? 'completed' : 'pending', date: null }
    ];
    
    const timelineHtml = trackingSteps.map(step => `
        <div class="timeline-item ${step.status}">
            <strong>${step.step}</strong>
            ${step.date ? `<div style="color: #6c757d; font-size: 12px;">${new Date(step.date).toLocaleDateString()}</div>` : ''}
        </div>
    `).join('');
    
    document.getElementById('tracking-result').innerHTML = `
        <div style="background: white; padding: 25px; border-radius: 15px; margin-top: 20px; border: 2px solid #e9ecef;">
            <h3>Seguimiento del Pedido ${order.id}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                <div>
                    <strong>Cliente:</strong><br>${order.cliente}
                </div>
                <div>
                    <strong>Destino:</strong><br>${order.paisDestino}
                </div>
                <div>
                    <strong>Estado Actual:</strong><br>
                    <span class="status-badge status-${order.estado}">${order.estado.toUpperCase()}</span>
                </div>
                ${order.tracking ? `
                <div>
                    <strong>Código de Seguimiento:</strong><br>${order.tracking}
                </div>
                ` : ''}
            </div>
            ${order.transporte ? `
            <div style="margin: 15px 0;">
                <strong>Información de Transporte:</strong><br>
                ${order.transporte}
            </div>
            ` : ''}
            <h4 style="margin-top: 25px; margin-bottom: 15px;">Estado del Envío</h4>
            <div class="tracking-timeline">
                ${timelineHtml}
            </div>
        </div>
    `;
    
    // Cambiar a la sección de seguimiento si no estamos ahí
    showSection('seguimiento');
    document.querySelector('[onclick="showSection(\'seguimiento\')"]').classList.add('active');
}

// Poblar selector de documentos
function populateDocumentSelect() {
    const select = document.getElementById('doc-order-id');
    select.innerHTML = '<option value="">Seleccionar pedido...</option>';
    
    orders.forEach(order => {
        const option = document.createElement('option');
        option.value = order.id;
        option.textContent = `${order.id} - ${order.cliente} (${order.paisDestino})`;
        select.appendChild(option);
    });
}

// Generar documentos
function generateDocument(type) {
    const orderId = document.getElementById('doc-order-id').value;
    if (!orderId) {
        alert('Por favor seleccione un pedido');
        return;
    }
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let documentContent = '';
    
    switch (type) {
        case 'guia':
            documentContent = generateExportGuide(order);
            break;
        case 'factura':
            documentContent = generateCommercialInvoice(order);
            break;
        case 'packing':
            documentContent = generatePackingList(order);
            break;
    }
    
    document.getElementById('document-preview').innerHTML = `
        <div style="background: white; border: 2px solid #e9ecef; border-radius: 15px; padding: 30px; margin-top: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
            ${documentContent}
            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-primary" onclick="printDocument()">🖨️ Imprimir</button>
                <button class="btn-secondary" onclick="downloadDocument('${type}', '${orderId}')">💾 Descargar PDF</button>
            </div>
        </div>
    `;
}

// Generar guía de exportación
function generateExportGuide(order) {
    return `
        <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">GUÍA DE EXPORTACIÓN</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
                <h3>INFORMACIÓN DEL EXPORTADOR</h3>
                <p><strong>Empresa:</strong> Mi Empresa Exportadora S.A.</p>
                <p><strong>RUC:</strong> 0912345678001</p>
                <p><strong>Dirección:</strong> Av. Principal 123, Guayaquil, Ecuador</p>
                <p><strong>Teléfono:</strong> +593 4 123-4567</p>
            </div>
            <div>
                <h3>INFORMACIÓN DEL IMPORTADOR</h3>
                <p><strong>Cliente:</strong> ${order.cliente}</p>
                <p><strong>País:</strong> ${order.paisDestino}</p>
                <p><strong>Fecha de Envío:</strong> ${new Date(order.fechaEnvio).toLocaleDateString()}</p>
            </div>
        </div>
        <h3>DETALLES DE LA MERCANCÍA</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Producto</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Variedad</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Cantidad</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Peso Estimado</th>
            </tr>
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 12px;">Producto Agrícola</td>
                <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px;">${order.cantidad.toLocaleString()} unidades</td>
                <td style="border: 1px solid #dee2e6; padding: 12px;">${(order.cantidad * 18.5).toLocaleString()} kg</td>
            </tr>
        </table>
        <div style="margin-top: 30px;">
            <p><strong>Número de Guía:</strong> ${order.id}-GE${new Date().getFullYear()}</p>
            <p><strong>Código de Seguimiento:</strong> ${order.tracking || 'Por asignar'}</p>
            <p><strong>Estado:</strong> ${order.estado.toUpperCase()}</p>
        </div>
    `;
}

// Generar factura comercial
function generateCommercialInvoice(order) {
    const subtotal = order.cantidad * order.precioUnitario;
    const tax = subtotal * 0.12; // IVA 12%
    const total = subtotal + tax;
    
    return `
        <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">FACTURA COMERCIAL</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
                <h3>VENDEDOR</h3>
                <p><strong>Mi Empresa Exportadora S.A.</strong></p>
                <p>RUC: 0912345678001</p>
                <p>Av. Principal 123</p>
                <p>Guayaquil, Ecuador</p>
                <p>Tel: +593 4 123-4567</p>
            </div>
            <div>
                <h3>COMPRADOR</h3>
                <p><strong>${order.cliente}</strong></p>
                <p>${order.paisDestino}</p>
                <br>
                <p><strong>Factura N°:</strong> ${order.id}-FC</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Términos:</strong> FOB</p>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Descripción</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cantidad</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Precio Unit.</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Total</th>
            </tr>
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${order.cantidad.toLocaleString()}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${order.precioUnitario.toFixed(2)}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${subtotal.toFixed(2)}</td>
            </tr>
        </table>
        <div style="text-align: right; margin-top: 20px;">
            <p><strong>Subtotal: ${subtotal.toFixed(2)}</strong></p>
            <p><strong>IVA (12%): ${tax.toFixed(2)}</strong></p>
            <p style="font-size: 1.2em; color: #2c3e50;"><strong>TOTAL: ${total.toFixed(2)} USD</strong></p>
        </div>
    `;
}

// Generar packing list
function generatePackingList(order) {
    const boxes = Math.ceil(order.cantidad / 100); // Aproximadamente 100 unidades por caja
    const grossWeight = order.cantidad * 18.5; // 18.5 kg promedio
    const netWeight = order.cantidad * 17.8; // Peso neto
    
    return `
        <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">LISTA DE EMPAQUE (PACKING LIST)</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
                <h3>EXPORTADOR</h3>
                <p><strong>Mi Empresa Exportadora S.A.</strong></p>
                <p>Guayaquil, Ecuador</p>
                <p>Tel: +593 4 123-4567</p>
            </div>
            <div>
                <h3>CONSIGNATARIO</h3>
                <p><strong>${order.cliente}</strong></p>
                <p>${order.paisDestino}</p>
                <br>
                <p><strong>Packing List N°:</strong> ${order.id}-PL</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
        </div>
        <h3>INFORMACIÓN DEL ENVÍO</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Descripción</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cajas</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Unidades/Caja</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Total Unidades</th>
            </tr>
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${boxes}</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~100</td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${order.cantidad.toLocaleString()}</td>
            </tr>
        </table>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
            <div>
                <h4>PESOS Y MEDIDAS</h4>
                <p><strong>Peso Bruto:</strong> ${grossWeight.toLocaleString()} kg</p>
                <p><strong>Peso Neto:</strong> ${netWeight.toLocaleString()} kg</p>
                <p><strong>Volumen:</strong> ${(boxes * 0.05).toFixed(2)} m³</p>
            </div>
            <div>
                <h4>MARCAS Y NÚMEROS</h4>
                <p><strong>Marca:</strong> EXPORT</p>
                <p><strong>Origen:</strong> ECUADOR</p>
                <p><strong>Destino:</strong> ${order.paisDestino}</p>
                <p><strong>Cajas numeradas:</strong> 1 a ${boxes}</p>
            </div>
        </div>
    `;
}

// Imprimir documento
function printDocument() {
    const content = document.getElementById('document-preview').querySelector('div').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Documento</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 8px; }
                h2, h3 { color: #2c3e50; }
                @media print { button { display: none; } }
            </style>
        </head>
        <body>${content}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Descargar documento (simulado)
function downloadDocument(type, orderId) {
    const fileName = `${type}_${orderId}_${new Date().toISOString().split('T')[0]}.pdf`;
    alert(`Descargando ${fileName}...\n\nEn una implementación real, aquí se generaría y descargaría el archivo PDF.`);
}

// Exportar a CSV
function exportToCSV() {
    const headers = ['ID', 'Cliente', 'País Destino', 'Variedad', 'Cantidad', 'Fecha Envío', 'Precio Unitario', 'Estado', 'Tracking'];
    const csvContent = [
        headers.join(','),
        ...orders.map(order => [
            order.id,
            `"${order.cliente}"`,
            order.paisDestino,
            `"${order.variedad}"`,
            order.cantidad,
            order.fechaEnvio,
            order.precioUnitario,
            order.estado,
            order.tracking || ''
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exportaciones_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}