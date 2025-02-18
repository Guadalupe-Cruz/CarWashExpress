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
                        <button class="icon-button recover-button" onclick="recuperarSucursal('${sucursal.id_sucursal}', '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
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
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar esta sucursal?',
        text: `Estás a punto de recuperar la sucursal ${nombre}, ubicada en ${direccion}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_sucursal_exposed(id, nombre, direccion)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Sucursal recuperada',
                    text: 'La sucursal ha sido recuperada exitosamente.'
                });
            });
        }
    });
}
