document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
    
    // Verificar el rol y ocultar botones si no es superusuario
    verificarPermisos();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

// Función para verificar permisos (rol del usuario)
function verificarPermisos() {
    let rol = sessionStorage.getItem("rol"); // Obtener rol desde sessionStorage
    console.log("Rol almacenado en sessionStorage:", rol);

    // Verificar si el rol es 'superusuario'
    if (rol !== "superusuario") {
        console.log("Administrador detectado, ocultando botones de superusuario.");
        // Si no es superusuario, ocultar las celdas que contienen los botones con la clase 'super-only'
        let filasSuperOnly = document.querySelectorAll(".super-only");
        console.log("Filas con clase 'super-only':", filasSuperOnly);

        filasSuperOnly.forEach(fila => {
            fila.style.display = "none"; // Ocultar la celda completa que contiene los botones
        });
    }
}

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
                    <td class="table-buttons super-only">
                        <button class="icon-button recover-button" onclick="recuperarRol('${rol.id_rol}', '${rol.nombre_rol}')">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
        // Después de llenar la tabla, verificar los permisos
        verificarPermisos();
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
