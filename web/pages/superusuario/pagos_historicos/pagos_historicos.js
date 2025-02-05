document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_pago()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoPagos");
        tabla.innerHTML = "";
        historico.forEach(pago => {
            let fila = `
                <tr>
                    <td>${pago.id_pago}</td>
                    <td>${pago.monto_pagado}</td>
                    <td>${pago.metodo_pago}</td>
                    <td>${pago.fecha_pago}</td>
                    <td>${pago.id_cliente}</td>
                    <td>${pago.id_lavado}</td>
                    <td>${pago.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarPago(${pago.id_pago}, '${pago.monto_pagado}', '${pago.metodo_pago}', '${pago.fecha_pago}',  '${pago.id_cliente}', '${pago.id_lavado}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarPago(id, monto, metodo, fecha, id_cliente, id_lavado) {
    eel.recuperar_pago_exposed(id, monto, metodo, fecha, id_cliente, id_lavado)(function () {
        obtenerHistorico();
    });
}