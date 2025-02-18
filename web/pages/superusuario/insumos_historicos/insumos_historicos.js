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
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar este insumo?',
        text: `Estás a punto de recuperar el insumo: ${nombre}, con inventario de ${inventario} y unidad: ${unidad}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_insumo_exposed(id, nombre, inventario, unidad, cantidad)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Insumo recuperado',
                    text: 'El insumo ha sido recuperado exitosamente.'
                });
            });
        }
    });
}