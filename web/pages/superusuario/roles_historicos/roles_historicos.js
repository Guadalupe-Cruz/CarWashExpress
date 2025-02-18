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
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar este rol?',
        text: `Estás a punto de recuperar el rol: ${nombre}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_rol_exposed(id, nombre)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Rol recuperado',
                    text: 'El rol ha sido recuperado exitosamente.'
                });
            });
        }
    });
}
