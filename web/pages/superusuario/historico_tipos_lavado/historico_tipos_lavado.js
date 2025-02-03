document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_tipo()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoLavado");
        tabla.innerHTML = "";
        historico.forEach(tipo => {
            let fila = `
                <tr>
                    <td>${tipo.id_lavado}</td>
                    <td>${tipo.nombre_lavado}</td>
                    <td>${tipo.duracion_minutos} minutos</td>
                    <td>${tipo.costos_pesos} pesos</td>
                    <td>${tipo.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarTipo(${tipo.id_lavado}, '${tipo.nombre_lavado}', '${tipo.duracion_minutos}', '${tipo.costos_pesos}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarTipo(id, nombre, duracion, costo) {
    eel.recuperar_tipo_exposed(id, nombre, duracion, costo)(function () {
        obtenerHistorico();
    });
}