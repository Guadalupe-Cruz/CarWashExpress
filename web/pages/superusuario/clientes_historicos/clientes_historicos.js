document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_cliente()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoClientes");
        tabla.innerHTML = "";
        historico.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre_cliente}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.fecha_expiracion_membresia}</td>
                    <td>${cliente.id_sucursal}</td>
                    <td>${cliente.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarCliente(${cliente.id_cliente}, '${cliente.nombre_cliente}', '${cliente.apellido_pt}', '${cliente.apellido_mt}',  '${cliente.correo}', '${cliente.telefono}', '${cliente.fecha_expiracion_membresia}', '${cliente.id_sucursal}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarCliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, membresia, id_sucursal) {
    eel.recuperar_cliente_exposed(id_cliente, nombre, apellido1, apellido2, correo, telefono, membresia, id_sucursal)(function () {
        obtenerHistorico();
    });
}