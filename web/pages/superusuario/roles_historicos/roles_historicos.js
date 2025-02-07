document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_rol()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoRoles");
        tabla.innerHTML = "";
        historico.forEach(rol => {
            let fila = `
                <tr>
                    <td>${rol.id_rol}</td>
                    <td>${rol.nombre_rol}</td>
                    <td>${rol.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarRol('${rol.id_rol}', '${rol.nombre_rol}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarRol(id, nombre) {
    eel.recuperar_rol_exposed(id, nombre)(function () {
        obtenerHistorico();
    });
}