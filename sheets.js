// Función para imprimir el pedido
function imprimirPedido(pedido) {
    const ventanaImpresion = window.open('', '_blank');
    const fecha = new Date().toLocaleString('es-ES');
    
    // Crear lista de productos
    const productosHTML = pedido.productos.map(producto => 
        `<li>${producto}</li>`
    ).join('');
    
    const contenido = `
        <html>
        <head>
            <title>Pedido #${pedido.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .pedido { border: 1px solid #000; padding: 10px; margin: 10px 0; }
                .footer { margin-top: 20px; text-align: center; }
                .hora { font-size: 0.9em; color: #666; }
                .productos { list-style-type: none; padding-left: 0; }
                .productos li { padding: 5px 0; border-bottom: 1px solid #eee; }
                .productos li:last-child { border-bottom: none; }
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
                <p><strong>Productos:</strong></p>
                <ul class="productos">
                    ${productosHTML}
                </ul>
                <p><strong>Estado:</strong> ${pedido.estado}</p>
            </div>
            <div class="footer">
                <p>¡Gracias por su pedido!</p>
            </div>
        </body>
        </html>
    `;
    
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
    ventanaImpresion.close();
} 