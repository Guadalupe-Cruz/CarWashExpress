document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_insumo()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoInsumos");
        tabla.innerHTML = "";
        historico.forEach(insumo => {
            let fila = `
                <tr>
                    <td>${insumo.id_insumo}</td>
                    <td>${insumo.nombre_insumo}</td>
                    <td>${insumo.inventario}</td>
                    <td>${insumo.unidades}</td>
                    <td>${insumo.cantidad_minima}</td>
                    <td>${insumo.fecha_suministro}</td>
                    <td>${insumo.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarInsumo(${insumo.id_insumo}, '${insumo.nombre_insumo}', '${insumo.inventario}', '${insumo.unidades}', '${insumo.cantidad_minima}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarInsumo(id, nombre, inventario, unidad, cantidad) {
    eel.recuperar_insumo_exposed(id, nombre, inventario, unidad, cantidad)(function () {
        obtenerHistorico();
    });
}