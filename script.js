// Función para obtener pedidos del localStorage
function obtenerPedidos() {
    const pedidos = localStorage.getItem('pedidos');
    return pedidos ? JSON.parse(pedidos) : [];
}

// Función para guardar pedidos en localStorage
function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function agregarPedido() {
    const mesa = document.getElementById("mesa").value;
    const producto = document.getElementById("producto").value;
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
        producto: producto,
        estado: "Pendiente",
        entregado: false
    };
    
    pedidos.push(nuevoPedido);
    guardarPedidos(pedidos);
    cargarPedidos();
}

function cargarPedidos() {
    const listaPedidos = document.getElementById("listaPedidos");
    listaPedidos.innerHTML = "";
    
    const pedidos = obtenerPedidos();
    pedidos.forEach(pedido => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-4 mb-2 mb-md-0">
                    <strong>${pedido.mesa}</strong> - ${pedido.producto} 
                    <span class="badge ${pedido.estado === 'Entregado' ? 'bg-success' : 'bg-warning'}">${pedido.estado}</span>
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
    const nuevoProducto = prompt("Ingrese el nuevo producto:");
    if (nuevoProducto) {
        const pedidos = obtenerPedidos();
        const pedidoIndex = pedidos.findIndex(p => p.id === id);
        
        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].producto = nuevoProducto;
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

// Cargar pedidos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarPedidos);
