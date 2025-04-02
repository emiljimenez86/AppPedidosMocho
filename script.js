// Función para obtener pedidos del localStorage
function obtenerPedidos() {
    const pedidos = localStorage.getItem('pedidos');
    return pedidos ? JSON.parse(pedidos) : [];
}

// Función para guardar pedidos en localStorage
function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

let productosSeleccionados = [];

function agregarProducto() {
    const selectProducto = document.getElementById("producto");
    const producto = selectProducto.value;
    
    if (!producto) {
        alert("Por favor, seleccione un producto");
        return;
    }
    
    productosSeleccionados.push(producto);
    actualizarProductosSeleccionados();
    selectProducto.value = "";
}

function actualizarProductosSeleccionados() {
    const contenedor = document.getElementById("productosSeleccionados");
    contenedor.innerHTML = productosSeleccionados.map((producto, index) => `
        <span class="producto-seleccionado">
            ${producto}
            <button class="btn btn-sm btn-danger ms-2" onclick="eliminarProducto(${index})">×</button>
        </span>
    `).join('');
}

function eliminarProducto(index) {
    productosSeleccionados.splice(index, 1);
    actualizarProductosSeleccionados();
}

function agregarPedido() {
    const mesa = document.getElementById("mesa").value;
    
    if (productosSeleccionados.length === 0) {
        alert("Por favor, agregue al menos un producto");
        return;
    }
    
    const fecha = new Date();
    const hora = fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const pedidos = obtenerPedidos();
    const nuevoPedido = {
        id: Date.now().toString(),
        fecha: fecha.toISOString(),
        hora: hora,
        mesa: mesa,
        productos: [...productosSeleccionados],
        estado: "Pendiente",
        entregado: false
    };
    
    pedidos.push(nuevoPedido);
    guardarPedidos(pedidos);
    
    productosSeleccionados = [];
    actualizarProductosSeleccionados();
    cargarPedidos();
}

function cargarPedidos() {
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";
    
    const pedidos = obtenerPedidos();
    
    pedidos.forEach(pedido => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.style.backgroundColor = '#f8f9fa'; // Fondo suave para cada pedido
        li.style.borderRadius = '8px';
        li.style.marginBottom = '10px';
        li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        // Crear lista de productos
        const productosHTML = pedido.productos.map(producto => 
            `<span class="producto-seleccionado" style="background-color: #e9ecef; padding: 4px 8px; border-radius: 4px; margin-right: 5px;">${producto}</span>`
        ).join('');
        
        li.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-4 mb-2 mb-md-0">
                    <strong style="color: #2c3e50;">${pedido.mesa}</strong>
                    <div class="mt-2">${productosHTML}</div>
                    <span class="badge ${pedido.estado === 'Entregado' ? 'bg-success' : 'bg-warning'}" style="font-size: 0.8em;">${pedido.estado}</span>
                </div>
                <div class="col-md-8">
                    <div class="btn-group mb-2 mb-md-0" role="group">
                        <button class='btn btn-warning btn-sm' onclick='modificarPedido("${pedido.id}")'>Modificar</button>
                        <button class='btn btn-danger btn-sm' onclick='eliminarPedido("${pedido.id}")'>Eliminar</button>
                        <button class='btn btn-secondary btn-sm' onclick='mostrarHora("${pedido.hora}")'>${pedido.hora}</button>
                    </div>
                    <div class="form-check form-check-inline ms-2">
                        <input class="form-check-input" type="checkbox" 
                            ${pedido.entregado ? 'checked' : ''} 
                            onchange='cambiarEstadoEntrega("${pedido.id}", this.checked)'
                            style="width: 20px; height: 20px; cursor: pointer;">
                        <label class="form-check-label">Entregado</label>
                    </div>
                    <button class='btn btn-info btn-sm ms-2' onclick='imprimirPedido(${JSON.stringify(pedido)})'>Imprimir</button>
                </div>
            </div>
        `;
        
        listaPedidos.appendChild(li);
    });
}

function mostrarHora(hora) {
    alert(`Hora del pedido: ${hora}`);
}

function modificarPedido(id) {
    const pedidos = obtenerPedidos();
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        const pedido = pedidos[pedidoIndex];
        const nuevosProductos = prompt("Ingrese los productos separados por coma:", pedido.productos.join(", "));
        if (nuevosProductos) {
            pedidos[pedidoIndex].productos = nuevosProductos.split(",").map(p => p.trim());
            guardarPedidos(pedidos);
            cargarPedidos();
        }
    }
}

function eliminarPedido(id) {
    if (confirm("¿Está seguro que desea eliminar este pedido?")) {
        const pedidos = obtenerPedidos();
        const pedidosFiltrados = pedidos.filter(p => p.id !== id);
        guardarPedidos(pedidosFiltrados);
        cargarPedidos();
    }
}

function cambiarEstadoEntrega(id, entregado) {
    const pedidos = obtenerPedidos();
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].entregado = entregado;
        pedidos[pedidoIndex].estado = entregado ? "Entregado" : "Pendiente";
        guardarPedidos(pedidos);
        cargarPedidos();
    }
}

function imprimirPedido(pedido) {
    const ventanaImpresion = window.open('', '_blank');
    const fecha = new Date().toLocaleString('es-ES');
    
    const contenido = `
        <html>
        <head>
            <title>Pedido #${pedido.id}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                }
                .pedido { 
                    border: 1px solid #000; 
                    padding: 15px; 
                    margin: 10px 0;
                    border-radius: 5px;
                }
                .footer { 
                    margin-top: 20px; 
                    text-align: center;
                    border-top: 2px solid #000;
                    padding-top: 10px;
                }
                .hora { 
                    font-size: 0.9em; 
                    color: #666; 
                }
                .productos { 
                    margin: 10px 0; 
                }
                .productos ul { 
                    list-style-type: none; 
                    padding: 0; 
                }
                .productos li { 
                    padding: 5px 0; 
                    border-bottom: 1px solid #eee;
                }
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .pedido {
                        border: none;
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Pedido de Restaurante</h2>
                <p>Fecha: ${fecha}</p>
                <p class="hora">Hora: ${pedido.hora}</p>
            </div>
            <div class="pedido">
                <p><strong>Mesa:</strong> ${pedido.mesa}</p>
                <div class="productos">
                    <p><strong>Productos:</strong></p>
                    <ul>
                        ${pedido.productos.map(producto => `<li>${producto}</li>`).join('')}
                    </ul>
                </div>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
            </div>
            <div class="footer">
                <p>¡Gracias por su pedido!</p>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                    Imprimir o Guardar como PDF
                </button>
            </div>
        </body>
        </html>
    `;
    
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
    
    // Esperar a que el contenido se cargue antes de mostrar el diálogo de impresión
    ventanaImpresion.onload = function() {
        ventanaImpresion.print();
    };
}

// Función para generar el resumen de cierre
function generarResumenCierre() {
    const pedidos = obtenerPedidos();
    const fecha = new Date().toLocaleString('es-ES');
    
    // Contar pedidos por estado
    const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length;
    
    // Contar pedidos por mesa
    const pedidosPorMesa = {};
    pedidos.forEach(pedido => {
        pedidosPorMesa[pedido.mesa] = (pedidosPorMesa[pedido.mesa] || 0) + 1;
    });
    
    const contenido = `
        <html>
        <head>
            <title>Resumen de Cierre - ${fecha}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                }
                .resumen { 
                    border: 1px solid #000; 
                    padding: 15px; 
                    margin: 10px 0;
                    border-radius: 5px;
                }
                .footer { 
                    margin-top: 20px; 
                    text-align: center;
                    border-top: 2px solid #000;
                    padding-top: 10px;
                }
                .tabla {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }
                .tabla th, .tabla td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: left;
                }
                .tabla th {
                    background-color: #f0f0f0;
                }
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .resumen {
                        border: none;
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>Resumen de Cierre</h2>
                <p>Fecha: ${fecha}</p>
            </div>
            <div class="resumen">
                <h3>Estadísticas Generales</h3>
                <p><strong>Total de Pedidos:</strong> ${pedidos.length}</p>
                <p><strong>Pedidos Pendientes:</strong> ${pedidosPendientes}</p>
                <p><strong>Pedidos Entregados:</strong> ${pedidosEntregados}</p>
                
                <h3>Pedidos por Mesa</h3>
                <table class="tabla">
                    <tr>
                        <th>Mesa</th>
                        <th>Cantidad de Pedidos</th>
                    </tr>
                    ${Object.entries(pedidosPorMesa).map(([mesa, cantidad]) => `
                        <tr>
                            <td>${mesa}</td>
                            <td>${cantidad}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h3>Detalle de Pedidos</h3>
                <table class="tabla">
                    <tr>
                        <th>Mesa</th>
                        <th>Hora</th>
                        <th>Productos</th>
                        <th>Estado</th>
                    </tr>
                    ${pedidos.map(pedido => `
                        <tr>
                            <td>${pedido.mesa}</td>
                            <td>${pedido.hora}</td>
                            <td>${pedido.productos.join(', ')}</td>
                            <td>${pedido.estado}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
            <div class="footer">
                <p>Este documento sirve como constancia del cierre de operaciones</p>
            </div>
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                    Imprimir o Guardar como PDF
                </button>
            </div>
        </body>
        </html>
    `;
    
    return contenido;
}

// Función para realizar el cierre de ventas
function realizarCierreVentas() {
    if (confirm("¿Está seguro que desea realizar el cierre de ventas? Esta acción generará un resumen y limpiará todos los pedidos actuales.")) {
        const ventanaCierre = window.open('', '_blank');
        ventanaCierre.document.write(generarResumenCierre());
        ventanaCierre.document.close();
        
        // Limpiar localStorage
        localStorage.removeItem('pedidos');
        
        // Recargar la lista de pedidos (ahora vacía)
        cargarPedidos();
        
        alert("Cierre de ventas realizado correctamente. Se ha generado el resumen y se han limpiado todos los pedidos.");
    }
}

// Asegurarnos de que la página esté cargada antes de ejecutar cualquier código
document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos al body
    document.body.style.backgroundColor = '#e9ecef'; // Fondo gris claro
    document.body.style.minHeight = '100vh';
    
    cargarPedidos();
    
    // Agregar botón de cierre de ventas
    const botonCierre = document.createElement('button');
    botonCierre.className = 'btn btn-danger btn-sm';
    botonCierre.onclick = realizarCierreVentas;
    botonCierre.textContent = 'Cierre de Ventas';
    botonCierre.style.position = 'fixed';
    botonCierre.style.top = '60px';
    botonCierre.style.right = '10px';
    botonCierre.style.zIndex = '1000';
    botonCierre.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    document.body.appendChild(botonCierre);
});
