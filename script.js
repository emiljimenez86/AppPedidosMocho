// =============================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// =============================================

let productosSeleccionados = [];
let pedidos = [];
let totalVentas = 0;

const precios = {
    "Picada de 25": 25000,
    "Picada de 30": 30000,
    "Picada de 40": 40000,
    "Picada de 50": 50000,
    "Perro Ranchero": 18000,
    "Perro Picada": 20000,
    "Hamburguesa Sencilla": 18000,
    "Hamburguesa Doble": 22000,
    "Hamburguesa Ranchera": 18000,
    "Salchipapa Ranchera": 20000,
    "Chuzo de Pollo": 20000,
    "Carne a la Plancha": 20000,
    "Coca cola 1.5L": 8000,
    "Hit Tropical": 5000,
    "Hit de mango": 5000,
    "Hit de mora": 5000,
    "Hit de piña naranja": 5000,
    "Colombiana Personal": 5000,
    "Naranjada Postobón": 5000,
    "Uva Postobón": 5000,
    "Manzana Postobón": 5000,
    "Pepsi Personal": 5000,
    "Agua Brisa Personal": 2000,
    "Cola Roman Personal": 5000,
    "Coca cola Personal": 5000,
    "Pilsen en lata": 5000,
    "Aguila Negra en lata": 5000,
    "DOMICILIO": 0
};

// Lista de productos que requieren salsas
const productosConSalsas = [
    "Picada de 25",
    "Picada de 30",
    "Picada de 40",
    "Picada de 50",
    "Perro Ranchero",
    "Perro Picada",
    "Hamburguesa Sencilla",
    "Hamburguesa Doble",
    "Hamburguesa Ranchera",
    "Salchipapa Ranchera",
    "Chuzo de Pollo",
    "Carne a la Plancha"
];

// =============================================
// FUNCIONES DE ALMACENAMIENTO
// =============================================

function obtenerPedidos() {
    const pedidos = localStorage.getItem('pedidos');
    return pedidos ? JSON.parse(pedidos) : [];
}

function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// =============================================
// FUNCIONES DE GESTIÓN DE PRODUCTOS
// =============================================

function mostrarSalsas() {
    const producto = document.getElementById('producto').value;
    const salsasContainer = document.getElementById('salsasContainer');
    const detallesContainer = document.getElementById('detallesContainer');
    
    if (productosConSalsas.includes(producto)) {
        salsasContainer.style.display = 'block';
    } else {
        salsasContainer.style.display = 'none';
    }
    
    // Mostrar campo de detalles para todos los productos
    detallesContainer.style.display = 'block';
}

function obtenerSalsasSeleccionadas() {
    const salsasContainer = document.getElementById("salsasContainer");
    const todasSalsas = document.getElementById("todasSalsas");
    
    if (todasSalsas.checked) {
        return ["Todas las salsas"];
    }
    
    const checkboxes = salsasContainer.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function obtenerDetallesEspeciales() {
    const detallesInput = document.getElementById('detallesProducto');
    return detallesInput.value.trim();
}

function agregarProducto() {
    try {
        const producto = document.getElementById('producto').value;
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const salsas = obtenerSalsasSeleccionadas();
        const detalles = obtenerDetallesEspeciales();
        
        console.log('Producto seleccionado:', producto);
        console.log('Cantidad:', cantidad);
        console.log('Salsas:', salsas);
        console.log('Detalles:', detalles);
        
        if (!producto) {
            alert('Por favor, seleccione un producto');
            return;
        }
        
        if (isNaN(cantidad) || cantidad <= 0) {
            alert('Por favor, ingrese una cantidad válida');
            return;
        }
        
        if (!precios[producto]) {
            alert('Error: No se encontró el precio para el producto seleccionado');
            return;
        }
        
        // Agregar el producto a la lista de productos seleccionados
        const nuevoProducto = {
            nombre: producto,
            precio: precios[producto],
            cantidad: cantidad,
            salsas: salsas,
            detalles: detalles
        };
        
        console.log('Nuevo producto a agregar:', nuevoProducto);
        
        productosSeleccionados.push(nuevoProducto);
        
        const productosSeleccionadosDiv = document.getElementById('productosSeleccionados');
        if (!productosSeleccionadosDiv) {
            alert('Error: No se encontró el contenedor de productos seleccionados');
            return;
        }
        
        const productoInfo = document.createElement('div');
        productoInfo.className = 'producto-seleccionado mb-2';
        
        let detallesHTML = '';
        if (salsas.length > 0) {
            detallesHTML += `<br>Salsas: ${salsas.join(', ')}`;
        }
        if (detalles) {
            detallesHTML += `<br>Detalles: ${detalles}`;
        }
        
        productoInfo.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span>${producto} x${cantidad} - $${precios[producto] * cantidad}</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(this)">Eliminar</button>
            </div>
            ${detallesHTML}
        `;
        
        productosSeleccionadosDiv.appendChild(productoInfo);
        
        // Limpiar campos
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '1';
        document.getElementById('salsasContainer').style.display = 'none';
        document.getElementById('detallesProducto').value = '';
        
        // Limpiar las salsas seleccionadas
        const checkboxes = document.querySelectorAll('#salsasContainer input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        console.log('Producto agregado exitosamente');
        console.log('Productos seleccionados actuales:', productosSeleccionados);
        
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('Ocurrió un error al agregar el producto. Por favor, intente nuevamente.');
    }
}

function actualizarProductosSeleccionados() {
    const contenedor = document.getElementById("productosSeleccionados");
    contenedor.innerHTML = productosSeleccionados.map((producto, index) => `
        <span class="producto-seleccionado">
            ${producto.nombre} - $${producto.precio.toLocaleString()}
            ${producto.salsas && producto.salsas.length > 0 ? 
                `<br><small>Salsas: ${producto.salsas.join(', ')}</small>` : 
                ''}
            <button class="btn btn-sm btn-danger ms-2" onclick="eliminarProducto(${index})">×</button>
        </span>
    `).join('');
}

function eliminarProducto(elemento) {
    const productoInfo = elemento.closest('.producto-seleccionado');
    const index = Array.from(productoInfo.parentNode.children).indexOf(productoInfo);
    
    // Eliminar el producto de la lista
    productosSeleccionados.splice(index, 1);
    
    // Eliminar el elemento del DOM
    productoInfo.remove();
}

// =============================================
// FUNCIONES DE GESTIÓN DE PEDIDOS
// =============================================

function agregarPedido() {
    const mesa = document.getElementById("mesa").value;
    
    if (productosSeleccionados.length === 0) {
        alert("Por favor, agregue al menos un producto");
        return;
    }
    
    if (!mesa) {
        alert("Por favor, seleccione una mesa");
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
        entregado: false,
        total: productosSeleccionados.reduce((sum, p) => sum + p.precio, 0)
    };
    
    pedidos.push(nuevoPedido);
    guardarPedidos(pedidos);
    
    // Limpiar el formulario
    productosSeleccionados = [];
    actualizarProductosSeleccionados();
    document.getElementById("mesa").value = "Mesa 1";
    
    // Recargar la lista de pedidos
    cargarPedidos();
}

function cargarPedidos() {
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";
    
    const pedidos = obtenerPedidos();
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    pedidos.forEach(pedido => {
        // Calcular el total del pedido considerando las cantidades
        const totalPedido = pedido.productos.reduce((sum, producto) => {
            return sum + (producto.precio * producto.cantidad);
        }, 0);
        
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.style.backgroundColor = '#f8f9fa';
        li.style.borderRadius = '8px';
        li.style.marginBottom = '10px';
        li.style.boxShadow = 'none';
        li.style.border = '2px solid #FFD700';
        li.style.transition = 'transform 0.3s ease';
        
        li.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
        };
        
        li.onmouseout = function() {
            this.style.transform = 'translateY(0)';
        };
        
        const productosHTML = pedido.productos.map(producto => {
            const subtotal = producto.precio * producto.cantidad;
            return `<div class="producto-seleccionado" style="background-color: #e9ecef; padding: 8px; border-radius: 4px; margin-bottom: 5px; border: 1px solid #FFD700;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <strong>${producto.nombre}</strong>
                    <span>$${producto.precio.toLocaleString()} x ${producto.cantidad} = $${subtotal.toLocaleString()}</span>
                </div>
                ${producto.salsas && producto.salsas.length > 0 ? 
                    `<div style="margin-top: 5px;"><strong>Salsas:</strong> ${producto.salsas.join(', ')}</div>` : 
                    ''}
                ${producto.detalles ? `<div style="margin-top: 5px;"><strong>Detalles:</strong> ${producto.detalles}</div>` : ''}
            </div>`;
        }).join('');
        
        li.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-4 mb-2 mb-md-0">
                    <strong style="color: #2c3e50;">${pedido.mesa}</strong>
                    <div class="mt-2">${productosHTML}</div>
                    <div class="mt-2">
                        <span class="badge ${pedido.estado === 'Entregado' ? 'bg-success' : 'bg-warning'}" style="font-size: 0.8em;">${pedido.estado}</span>
                        <span class="badge bg-info ms-2">Total: $${totalPedido.toLocaleString()}</span>
                    </div>
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

function modificarPedido(id) {
    const pedidos = obtenerPedidos();
    const pedidoIndex = pedidos.findIndex(p => p.id === id);
    
    if (pedidoIndex !== -1) {
        const pedido = pedidos[pedidoIndex];
        
        // Mostrar un modal o formulario con los datos actuales
        const nuevoProducto = prompt("Ingrese el nuevo producto:", pedido.productos[0].nombre);
        if (nuevoProducto) {
            const nuevaCantidad = prompt("Ingrese la nueva cantidad:", pedido.productos[0].cantidad);
            if (nuevaCantidad) {
                const precio = precios[nuevoProducto] || pedido.productos[0].precio;
                pedidos[pedidoIndex].productos = [{
                    nombre: nuevoProducto,
                    precio: precio,
                    cantidad: parseInt(nuevaCantidad),
                    salsas: pedido.productos[0].salsas || [],
                    detalles: pedido.productos[0].detalles || ''
                }];
                
                // Recalcular el total
                pedidos[pedidoIndex].total = pedidos[pedidoIndex].productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
                
                guardarPedidos(pedidos);
                cargarPedidos();
            }
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

// =============================================
// FUNCIONES DE IMPRESIÓN Y VISUALIZACIÓN
// =============================================

function mostrarHora(hora) {
    alert(`Hora del pedido: ${hora}`);
}

function imprimirPedido(pedido) {
    const ventanaImpresion = window.open('', '_blank');
    const fecha = new Date().toLocaleString('es-ES');
    
    // Asegurarnos de que los productos tengan los precios actualizados
    const productosActualizados = pedido.productos.map(producto => ({
        nombre: producto.nombre,
        precio: precios[producto.nombre] || producto.precio,
        cantidad: producto.cantidad || 1,
        salsas: producto.salsas || [],
        detalles: producto.detalles || ''
    }));
    
    // Recalcular el total con los precios actualizados y las cantidades
    const totalActualizado = productosActualizados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    
    const contenido = `
        <html>
        <head>
            <title>Pedido #${pedido.id}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                @page {
                    size: 80mm 297mm;
                    margin: 0;
                }
                body { 
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    width: 80mm;
                    margin: 0;
                    padding: 5px;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 5px;
                    border-bottom: 1px dashed #000;
                    padding-bottom: 5px;
                }
                .pedido { 
                    margin: 5px 0;
                }
                .footer { 
                    margin-top: 5px; 
                    text-align: center;
                    border-top: 1px dashed #000;
                    padding-top: 5px;
                }
                .hora { 
                    font-size: 10px; 
                }
                .productos { 
                    margin: 5px 0; 
                }
                .productos ul { 
                    list-style-type: none; 
                    padding: 0; 
                    margin: 0;
                }
                .productos li { 
                    padding: 2px 0; 
                    border-bottom: 1px dotted #ccc;
                }
                .nombre-producto {
                    font-size: 14px;
                    font-weight: bold;
                    color: #000;
                }
                .salsas {
                    font-size: 14px;
                    color: #000;
                    margin-left: 10px;
                    font-weight: bold;
                }
                .detalles {
                    font-size: 14px;
                    color: #000;
                    margin-left: 10px;
                    font-weight: bold;
                }
                .total {
                    text-align: right;
                    font-weight: bold;
                    margin-top: 5px;
                }
                .botones {
                    text-align: center;
                    margin-top: 10px;
                }
                .botones button {
                    margin: 5px;
                    padding: 8px 15px;
                    font-size: 14px;
                    cursor: pointer;
                }
                .tabla-productos {
                    width: 100%;
                    border-collapse: collapse;
                }
                .tabla-productos th {
                    text-align: left;
                    padding: 2px;
                    border-bottom: 1px solid #000;
                }
                .tabla-productos td {
                    padding: 2px;
                    border-bottom: 1px dotted #ccc;
                }
                @media print {
                    .botones {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h2 style="font-size: 14px; margin: 0;">PEDIDO</h2>
                <p style="margin: 2px 0;">${fecha}</p>
                <p class="hora">${pedido.hora}</p>
            </div>
            <div class="pedido">
                <p><strong>Mesa:</strong> ${pedido.mesa}</p>
                <div class="productos">
                    <table class="tabla-productos">
                        <tr>
                            <th>Producto</th>
                            <th>Cant.</th>
                            <th>Total</th>
                        </tr>
                        ${productosActualizados.map(producto => `
                            <tr>
                                <td>
                                    <span class="nombre-producto">${producto.nombre}</span>
                                    ${producto.salsas.length > 0 ? 
                                        `<div class="salsas">Salsas: ${producto.salsas.join(', ')}</div>` : 
                                        ''}
                                    ${producto.detalles ? `<div class="detalles">Detalles: ${producto.detalles}</div>` : ''}
                                </td>
                                <td>${producto.cantidad}</td>
                                <td>$${(producto.precio * producto.cantidad).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
                <div class="total">
                    Total: $${totalActualizado.toLocaleString()}
                </div>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
            </div>
            <div class="footer">
                <p style="margin: 0; font-weight: bold;">Donde el Mocho Comidas rápidas</p>
            </div>
            <div class="botones">
                <button onclick="window.print()">Imprimir</button>
                <button onclick="window.close()">Cerrar</button>
            </div>
        </body>
        </html>
    `;
    
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
}

// =============================================
// FUNCIONES DE CIERRE DE VENTAS
// =============================================

function seleccionarTodasSalsas(checkbox) {
    const salsas = document.querySelectorAll('#salsasContainer input[type="checkbox"]:not(#todasSalsas)');
    salsas.forEach(salsa => {
        salsa.checked = false;
    });
}

function generarResumenCierre() {
    const pedidos = obtenerPedidos();
    const fecha = new Date().toLocaleString('es-ES');
    
    const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
    const pedidosEntregados = pedidos.filter(p => p.estado === 'Entregado').length;
    
    // Calcular el total de ventas considerando las cantidades
    const totalVentas = pedidos.reduce((sum, pedido) => {
        const totalPedido = pedido.productos.reduce((pedidoSum, producto) => {
            return pedidoSum + (producto.precio * producto.cantidad);
        }, 0);
        return sum + totalPedido;
    }, 0);
    
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
                .total-ventas {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #28a745;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border-radius: 5px;
                    text-align: center;
                }
                .pedido-container {
                    margin-bottom: 20px;
                    border: 1px solid #ddd;
                    padding: 10px;
                    border-radius: 5px;
                }
                .tabla-productos {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 5px 0;
                }
                .tabla-productos th, .tabla-productos td {
                    border: 1px solid #ddd;
                    padding: 4px;
                    text-align: left;
                }
                .tabla-productos th {
                    background-color: #f5f5f5;
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
                
                <div class="total-ventas">
                    <strong>Total de Ventas:</strong> $${totalVentas.toLocaleString()}
                </div>
                
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
                ${pedidos.map(pedido => {
                    const totalPedido = pedido.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
                    return `
                        <div class="pedido-container">
                            <p><strong>Mesa:</strong> ${pedido.mesa} | <strong>Hora:</strong> ${pedido.hora} | <strong>Estado:</strong> ${pedido.estado}</p>
                            <table class="tabla-productos">
                                <tr>
                                    <th>Producto</th>
                                    <th>Cant.</th>
                                    <th>Total</th>
                                </tr>
                                ${pedido.productos.map(p => `
                                    <tr>
                                        <td>
                                            ${p.nombre}
                                            ${p.salsas && p.salsas.length > 0 ? 
                                                `<br><small>Salsas: ${p.salsas.join(', ')}</small>` : 
                                                ''}
                                            ${p.detalles ? `<br><small>Detalles: ${p.detalles}</small>` : ''}
                                        </td>
                                        <td>${p.cantidad}</td>
                                        <td>$${(p.precio * p.cantidad).toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </table>
                            <p style="text-align: right; margin-top: 5px;"><strong>Total Pedido:</strong> $${totalPedido.toLocaleString()}</p>
                        </div>
                    `;
                }).join('')}
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

function realizarCierreVentas() {
    if (confirm("¿Está seguro que desea realizar el cierre de ventas? Esta acción generará un resumen y limpiará todos los pedidos actuales.")) {
        const ventanaCierre = window.open('', '_blank');
        ventanaCierre.document.write(generarResumenCierre());
        ventanaCierre.document.close();
        
        localStorage.removeItem('pedidos');
        cargarPedidos();
        
        alert("Cierre de ventas realizado correctamente. Se ha generado el resumen y se han limpiado todos los pedidos.");
    }
}

// =============================================
// INICIALIZACIÓN Y EVENTOS
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.backgroundColor = '#e9ecef';
    document.body.style.minHeight = '100vh';
    
    cargarPedidos();
});

// Verificar si el Service Worker está disponible y registrarlo
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log("Service Worker registrado"))
        .catch(error => console.log("Error registrando SW:", error));
}

// Variables de instalación
let deferredPrompt;
const installBtn = document.getElementById("installBtn");
const iosInstructions = document.getElementById("ios-instructions");

// Función para detectar si la app ya está instalada en iPhone o Android
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Ocultar los mensajes si la app ya está instalada
function checkInstallationStatus() {
    if (isAppInstalled()) {
        installBtn.style.display = "none";
        iosInstructions.style.display = "none";
    }
}

// Ejecutar la verificación al cargar la página
document.addEventListener("DOMContentLoaded", checkInstallationStatus);

// Detectar si es iOS para mostrar instrucciones
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

if (isIOS()) {
    document.addEventListener("DOMContentLoaded", () => {
        if (!isAppInstalled()) {
            iosInstructions.style.display = "block"; // Mostrar solo si no está instalada
        }
    });
} else {
    // Solo mostrar el botón en Android cuando la app no está instalada
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredPrompt = event;
        if (!isAppInstalled()) {
            installBtn.style.display = "block";
        }
    });

    installBtn.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
                if (choice.outcome === "accepted") {
                    console.log("App instalada");
                    installBtn.style.display = "none";
                    iosInstructions.style.display = "none"; // Ocultar mensaje en iOS también
                }
                deferredPrompt = null;
            });
        }
    });

    // También ocultar el botón y mensajes si la app se instala en Android
    window.addEventListener("appinstalled", () => {
        console.log("PWA instalada");
        installBtn.style.display = "none";
        iosInstructions.style.display = "none";
    });
}

function actualizarPedidos() {
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";
    pedidos.forEach((pedido, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `<strong>${pedido.mesa}</strong>: ${pedido.productos.map(p => p.nombre).join(", ")} - <strong>Total: $${pedido.total.toLocaleString()}</strong>`;
        listaPedidos.appendChild(li);
    });
    mostrarTotalVentas();
}

function mostrarTotalVentas() {
    let totalDiv = document.getElementById("totalVentas");
    if (!totalDiv) {
        totalDiv = document.createElement("div");
        totalDiv.id = "totalVentas";
        totalDiv.classList.add("text-center", "mt-4");
        document.body.appendChild(totalDiv);
    }
    totalDiv.innerHTML = `<h3>Total de Ventas: $${totalVentas}</h3>`;
}
