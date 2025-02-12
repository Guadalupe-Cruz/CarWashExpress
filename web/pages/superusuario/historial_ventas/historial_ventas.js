document.addEventListener("DOMContentLoaded", function () {
    obtenerVentas();
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

function obtenerTipos() {
    eel.obtener_tipos()(function(tipos) {
        const select = document.getElementById('id_lavado');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_cliente;
            option.textContent = tipo.nombre_lavado;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

function obtenerVentas() {
    eel.obtener_ventas()(function (ventas) {
        let tabla = document.getElementById("tablaVentas");
        tabla.innerHTML = ""; 
        ventas.forEach(venta => {
            let fila = `
                <tr>
                    <td>${venta.id_historial}</td>
                    <td>${venta.tiempo_inicio}</td>
                    <td>${venta.tiempo_fin}</td>
                    <td>${venta.monto_pagado}</td>
                    <td>${venta.metodo_pago}</td>
                    <td>${venta.fecha_pago}</td>
                    <td>${venta.nombre_lavado}</td>
                    <td>${venta.nombre_cliente}</td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}
