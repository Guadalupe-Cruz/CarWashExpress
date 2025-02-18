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
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar este tipo de lavado',
        text: `Estás a punto de recuperar el tipo de lavado: ${nombre}, con duración de ${duracion} minutos y costo de ${costo} pesos.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_tipo_exposed(id, nombre, duracion, costo)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Tipo recuperado',
                    text: 'El tipo de lavado ha sido recuperado exitosamente.'
                });
            });
        }
    });
}
