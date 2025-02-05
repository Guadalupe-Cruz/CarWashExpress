document.addEventListener("DOMContentLoaded", function () {
    obtenerPagos();
    obtenerClientes();
    obtenerTipos();
});

function obtenerClientes() {
    eel.obtener_clientes()(function(clientes) {
        const select = document.getElementById('id_cliente');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente;
            option.textContent = cliente.nombre_cliente;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

function obtenerPagos() {
    eel.obtener_pagos()(function (pagos) {
        let tabla = document.getElementById("tablaPagos");
        tabla.innerHTML = ""; 
        pagos.forEach(pago => {
            let fila = `
                <tr>
                    <td>${pago.id_pago}</td>
                    <td>${pago.monto_pagado}</td>
                    <td>${pago.metodo_pago}</td>
                    <td>${pago.fecha_pago}</td>
                    <td>${pago.nombre_cliente}</td>
                    <td>${pago.nombre_lavado}</td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

