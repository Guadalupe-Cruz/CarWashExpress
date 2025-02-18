document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

function obtenerHistorico() {
    eel.obtener_historico_promocion()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoPromociones");
        tabla.innerHTML = "";
        historico.forEach(promocion => {
            let fila = `
                <tr>
                    <td>${promocion.id_promocion}</td>
                    <td>${promocion.nombre_promociones}</td>
                    <td>${promocion.descripcion}</td>
                    <td>${promocion.descuento}</td>
                    <td>${promocion.fecha_inicio}</td>
                    <td>${promocion.fecha_fin}</td>
                    <td>${promocion.fecha_borrado}</td>
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarPromocion(${promocion.id_promocion}, '${promocion.nombre_promociones}', '${promocion.descripcion}', '${promocion.descuento}',  '${promocion.fecha_inicio}', '${promocion.fecha_fin}', '${promocion.id_sucursal}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarPromocion(id, nombre, descripcion, descuento, fecha1, fecha2) {
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar esta promoción?',
        text: `Estás a punto de recuperar la promoción: ${nombre} con un descuento de ${descuento}% entre las fechas ${fecha1} y ${fecha2}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_promocion_exposed(id, nombre, descripcion, descuento, fecha1, fecha2)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Promoción recuperada',
                    text: 'La promoción ha sido recuperada exitosamente.'
                });
            });
        }
    });
}