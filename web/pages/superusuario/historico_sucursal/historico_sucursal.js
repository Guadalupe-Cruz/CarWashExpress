document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico()(function (historico) {
        let tabla = document.getElementById("tablaHistorico");
        tabla.innerHTML = "";
        historico.forEach(sucursal => {
            let fila = `
                <tr>
                    <td>${sucursal.id_sucursal}</td>
                    <td>${sucursal.nombre_sucursal}</td>
                    <td>${sucursal.direccion}</td>
                    <td>${sucursal.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarSucursal(${sucursal.id_sucursal}, '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarSucursal(id, nombre, direccion) {
    eel.recuperar_sucursal_exposed(id, nombre, direccion)(function () {
        obtenerHistorico();
    });
}